package com.example.demoERP.service;

import com.example.demoERP.dto.SupplierDto;
import com.example.demoERP.pojo.ProductsPojo;
import com.example.demoERP.pojo.SupplierPojo;
import com.example.demoERP.repository.ProductRepository;
import com.example.demoERP.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productsRepository;

    public SupplierPojo insertSupplier(SupplierDto dto) {

        SupplierPojo supplier = new SupplierPojo();

        supplier.setSupplierName(dto.getSupplierName());
        supplier.setDescription(dto.getDescription());
        supplier.setAddress(dto.getAddress());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());

        List<ProductsPojo> products =
                productsRepository.findAllById(dto.getProductIds());

        if (products.size() != dto.getProductIds().size()) {
            throw new IllegalArgumentException(
                    "One or more product IDs do not exist");
        }

        supplier.setProducts(products);

        return supplierRepository.save(supplier);
    }

    public List<SupplierPojo> findAllSuppliers() {
        return supplierRepository.findAll();
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    public SupplierPojo updateSupplier(Long id, SupplierDto dto) {
        SupplierPojo supplier = supplierRepository.findById(id).orElseThrow(()->new RuntimeException("Supplier not found"));
        supplier.setSupplierName(dto.getSupplierName());
        supplier.setDescription(dto.getDescription());
        supplier.setAddress(dto.getAddress());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        List<ProductsPojo> supProducts =productsRepository.findAllById(dto.getProductIds());
        supplier.setProducts(supProducts);
        return supplierRepository.save(supplier);
    }

    public SupplierPojo getSupplierById(Long id) {
        return supplierRepository.findById(id).orElseThrow(()->new RuntimeException("Supplier not found"));
    }
}