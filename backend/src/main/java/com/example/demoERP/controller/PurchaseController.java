package com.example.demoERP.controller;


import com.example.demoERP.dto.PurchaseRequestDto;
import com.example.demoERP.pojo.PurchaseHeaderPojo;
import com.example.demoERP.service.PurchaseService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp/purchase")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class PurchaseController {

    private PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<PurchaseHeaderPojo> insert(@RequestBody PurchaseRequestDto purchaseRequestDto){
        PurchaseHeaderPojo pojo=purchaseService.insertData(purchaseRequestDto);
        return ResponseEntity.ok().body(pojo);
    }

    @GetMapping
    public ResponseEntity<List<PurchaseHeaderPojo>> getAllData(){
        return ResponseEntity.ok().body(purchaseService.getAllData());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseHeaderPojo> updatePurchase(
            @PathVariable Long id,
            @RequestBody PurchaseRequestDto dto) {

        PurchaseHeaderPojo updatedPurchase =
                purchaseService.updateData(id, dto);

        return ResponseEntity.ok(updatedPurchase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchase(@PathVariable Long id){
        purchaseService.deleteData(id);
        return ResponseEntity.noContent().build();
    }

}
