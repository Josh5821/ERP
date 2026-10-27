package com.example.demoERP.controller;

import com.example.demoERP.pojo.ProductsPojo;
import com.example.demoERP.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/erp/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ProductsPojo> insertData(@RequestBody ProductsPojo productsPojo) {
    ProductsPojo newProduct = productService.insert(productsPojo);
    return ResponseEntity.ok(newProduct);
    }

    @GetMapping
    public ResponseEntity<List<ProductsPojo>> findAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @PutMapping("/{id}")
    public ProductsPojo updateData(@PathVariable Long id, @RequestBody ProductsPojo productsPojo) {
        return productService.update(id,productsPojo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteData(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
