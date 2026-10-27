
package com.example.demoERP.service;

import com.example.demoERP.dto.SalesRequestDto;
import com.example.demoERP.dto.SalesItemRequestDto;
import com.example.demoERP.pojo.*;
import com.example.demoERP.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final SalesHeaderRepository salesHeaderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productsRepository;

    @Transactional
    public SalesHeaderPojo createSale(SalesRequestDto request) {

        // Get customer
        CustomerPojo customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Create sales header
        SalesHeaderPojo sale = new SalesHeaderPojo();
        sale.setCustomer(customer);
        sale.setSalesDate(
                request.getSalesDate() != null
                        ? request.getSalesDate()
                        : LocalDate.now()
        );

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        List<SalesItemPojo> items = new ArrayList<>();

        // Process products
        for (SalesItemRequestDto dto : request.getItems()) {

            ProductsPojo product = productsRepository
                    .findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            BigDecimal itemSubtotal = dto.getUnitPrice()
                    .multiply(BigDecimal.valueOf(dto.getQuantity()));

            BigDecimal itemTax = itemSubtotal
                    .multiply(dto.getTaxPercent())
                    .divide(new BigDecimal("100"), 2,
                            java.math.RoundingMode.HALF_UP);

            BigDecimal itemTotal = itemSubtotal.add(itemTax);

            // Create sales item
            SalesItemPojo item = new SalesItemPojo();
            item.setSalesHeader(sale);
            item.setProducts(product);
            item.setQuantity(dto.getQuantity());
            item.setUnitPrice(dto.getUnitPrice());
            item.setTaxPercent(dto.getTaxPercent());
            item.setTaxAmount(itemTax);
            item.setTotalPrice(itemTotal);

            items.add(item);

            subtotal = subtotal.add(itemSubtotal);
            taxAmount = taxAmount.add(itemTax);
        }

        // Set totals
        sale.setSubtotal(subtotal);
        sale.setTaxAmount(taxAmount);
        sale.setTotalAmount(subtotal.add(taxAmount));
        sale.setItems(items);

        // Save sale and items
        return salesHeaderRepository.save(sale);
    }

    public List<SalesHeaderPojo> getAllSales(){
        return salesHeaderRepository.findAll();
    }

    @Transactional
    public SalesHeaderPojo updateSale(Long saleId, SalesRequestDto request) {

        // 1. Find the existing sale
        SalesHeaderPojo sale = salesHeaderRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        // 2. Find the customer
        CustomerPojo customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        sale.setCustomer(customer);

        if (request.getSalesDate() != null) {
            sale.setSalesDate(request.getSalesDate());
        }

        // 3. Recalculate totals using the updated items
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        List<SalesItemPojo> updatedItems = new ArrayList<>();

        for (SalesItemRequestDto dto : request.getItems()) {

            ProductsPojo product = productsRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            BigDecimal unitPrice = dto.getUnitPrice();
            BigDecimal taxPercent = dto.getTaxPercent();
            Integer quantity = dto.getQuantity();

            if (unitPrice == null ||
                    unitPrice.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Invalid unit price");
            }

            if (quantity == null || quantity <= 0) {
                throw new RuntimeException("Invalid quantity");
            }

            if (taxPercent == null ||
                    taxPercent.compareTo(BigDecimal.ZERO) < 0 ||
                    taxPercent.compareTo(new BigDecimal("100")) > 0) {
                throw new RuntimeException("Invalid tax percentage");
            }

            BigDecimal itemSubtotal = unitPrice
                    .multiply(BigDecimal.valueOf(quantity))
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal itemTax = itemSubtotal
                    .multiply(taxPercent)
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

            BigDecimal itemTotal = itemSubtotal.add(itemTax);

            SalesItemPojo item = new SalesItemPojo();
            item.setSalesHeader(sale);
            item.setProducts(product);
            item.setQuantity(quantity);
            item.setUnitPrice(unitPrice);
            item.setTaxPercent(taxPercent);
            item.setTaxAmount(itemTax);
            item.setTotalPrice(itemTotal);

            updatedItems.add(item);

            subtotal = subtotal.add(itemSubtotal);
            taxAmount = taxAmount.add(itemTax);
        }

        // 4. Replace the old items with the updated items
        sale.getItems().clear();
        sale.getItems().addAll(updatedItems);

        // 5. Update the totals
        sale.setSubtotal(subtotal);
        sale.setTaxAmount(taxAmount);
        sale.setTotalAmount(subtotal.add(taxAmount));

        // 6. Save the updated sale
        return salesHeaderRepository.save(sale);
    }

    public SalesHeaderPojo getSaleById(Long id) {
        return salesHeaderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    public void deleteSale(Long saleId) {
        salesHeaderRepository.deleteById(saleId);
    }

}
