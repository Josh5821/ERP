
package com.example.demoERP.controller;

import com.example.demoERP.dto.SalesRequestDto;
import com.example.demoERP.pojo.SalesHeaderPojo;
import com.example.demoERP.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SalesController {

    private final SalesService salesService;

    @PostMapping
    public ResponseEntity<SalesHeaderPojo> createSale(@RequestBody SalesRequestDto request) {

        SalesHeaderPojo sale = salesService.createSale(request);

        return ResponseEntity.ok(sale);
    }

    @GetMapping
    public List<SalesHeaderPojo> getAllSales() {
        return salesService.getAllSales();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesHeaderPojo> updateSale(
            @PathVariable Long id,
            @RequestBody SalesRequestDto request) {

        SalesHeaderPojo updatedSale = salesService.updateSale(id, request);

        return ResponseEntity.ok(updatedSale);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesHeaderPojo> getSaleById(
            @PathVariable Long id) {

        SalesHeaderPojo sale = salesService.getSaleById(id);

        return ResponseEntity.ok(sale);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        salesService.deleteSale(id);
        return ResponseEntity.ok().build();
    }


}
