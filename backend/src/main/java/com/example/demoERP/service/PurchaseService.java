package com.example.demoERP.service;

import com.example.demoERP.dto.PurchaseItemRequestDto;
import com.example.demoERP.dto.PurchaseRequestDto;
import com.example.demoERP.pojo.ProductsPojo;
import com.example.demoERP.pojo.PurchaseHeaderPojo;
import com.example.demoERP.pojo.PurchaseItemPojo;
import com.example.demoERP.pojo.SupplierPojo;
import com.example.demoERP.repository.ProductRepository;
import com.example.demoERP.repository.PurchaseHeaderRepository;
import com.example.demoERP.repository.SupplierRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@AllArgsConstructor
public class PurchaseService {

    private final PurchaseHeaderRepository purchaseHeaderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    @Transactional
    public PurchaseHeaderPojo insertData(PurchaseRequestDto purchaseRequestDto) {

        if (purchaseRequestDto.getPurchaseItems() == null
                || purchaseRequestDto.getPurchaseItems().isEmpty()) {
            throw new RuntimeException("At least one purchase item is required");
        }

        SupplierPojo supplier = supplierRepository.findById(purchaseRequestDto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("supplier not found"));

        PurchaseHeaderPojo purchaseHeaderPojo = new PurchaseHeaderPojo();
        purchaseHeaderPojo.setSupplier(supplier);
        purchaseHeaderPojo.setPurchaseDate(purchaseRequestDto.getPurchaseDate());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (PurchaseItemRequestDto dto : purchaseRequestDto.getPurchaseItems()) {

            ProductsPojo product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("product not found"));

            // Calculations for THIS item only
            BigDecimal lineSubtotal = dto.getPurchasePrice()
                    .multiply(BigDecimal.valueOf(dto.getQuantity()));

            BigDecimal lineTax = lineSubtotal
                    .multiply(dto.getTaxPercent())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            PurchaseItemPojo purchaseItemPojo = new PurchaseItemPojo();
            purchaseItemPojo.setProduct(product);
            purchaseItemPojo.setPurchasePrice(dto.getPurchasePrice());
            purchaseItemPojo.setQuantity(dto.getQuantity());
            purchaseItemPojo.setTaxPercent(dto.getTaxPercent());
            purchaseItemPojo.setTaxAmount(lineTax);
            purchaseItemPojo.setTotalPrice(lineSubtotal.add(lineTax));
            purchaseItemPojo.setPurchaseHeader(purchaseHeaderPojo);

            purchaseHeaderPojo.getItems().add(purchaseItemPojo);

            // Accumulate into the header totals
            subtotal = subtotal.add(lineSubtotal);
            totalTax = totalTax.add(lineTax);
        }

        purchaseHeaderPojo.setSubtotal(subtotal);
        purchaseHeaderPojo.setTaxAmount(totalTax);
        purchaseHeaderPojo.setTotalAmount(subtotal.add(totalTax));

        return purchaseHeaderRepository.save(purchaseHeaderPojo);
    }

    @Transactional(readOnly = true)
    public List<PurchaseHeaderPojo> getAllData() {
        return purchaseHeaderRepository.findAll();
    }

    @Transactional
    public PurchaseHeaderPojo updateData(
            Long id,
            PurchaseRequestDto dto) {

        // 1. Find the existing purchase
        PurchaseHeaderPojo header = purchaseHeaderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Purchase not found"));

        // 2. Find the supplier
        SupplierPojo supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));

        header.setSupplier(supplier);
        header.setPurchaseDate(dto.getPurchaseDate());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        // 3. Replace the existing purchase items
        header.getItems().clear();

        for (PurchaseItemRequestDto itemDto : dto.getPurchaseItems()) {

            ProductsPojo product = productRepository
                    .findById(itemDto.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            BigDecimal lineSubtotal = itemDto.getPurchasePrice()
                    .multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            BigDecimal lineTax = lineSubtotal
                    .multiply(itemDto.getTaxPercent())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            PurchaseItemPojo item = new PurchaseItemPojo();

            item.setProduct(product);
            item.setPurchasePrice(itemDto.getPurchasePrice());
            item.setQuantity(itemDto.getQuantity());
            item.setTaxPercent(itemDto.getTaxPercent());
            item.setTaxAmount(lineTax);
            item.setTotalPrice(lineSubtotal.add(lineTax));
            item.setPurchaseHeader(header);

            header.getItems().add(item);

            subtotal = subtotal.add(lineSubtotal);
            totalTax = totalTax.add(lineTax);
        }

        // 4. Update purchase totals
        header.setSubtotal(subtotal);
        header.setTaxAmount(totalTax);
        header.setTotalAmount(subtotal.add(totalTax));

        // 5. Save the updated purchase
        return purchaseHeaderRepository.save(header);
    }

    @Transactional
    public void deleteData(Long id) {

        PurchaseHeaderPojo purchase = purchaseHeaderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Purchase not found with id: " + id)
                );

        purchaseHeaderRepository.delete(purchase);
    }


}
