package com.example.demoERP.controller;

import com.example.demoERP.dto.SupplierDto;
import com.example.demoERP.pojo.SupplierPojo;
import com.example.demoERP.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp/supplier")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    public SupplierPojo insertSupplier(
            @RequestBody SupplierDto supplierDto) {

        return supplierService.insertSupplier(supplierDto);
    }
    @GetMapping
    public List<SupplierPojo> findAllSuppliers() {
        return supplierService.findAllSuppliers();
    }
    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
    }
    @PutMapping("/{id}")
    public SupplierPojo updateSupplier(@PathVariable Long id, @RequestBody SupplierDto supplierDto) {
        return supplierService.updateSupplier(id, supplierDto);
    }
    @GetMapping("/{id}")
    public SupplierPojo getSupplierById(@PathVariable Long id) {
        return supplierService.getSupplierById(id);
    }

}