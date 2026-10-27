package com.example.demoERP.controller;


import com.example.demoERP.pojo.CustomerPojo;
import com.example.demoERP.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp/customer")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerPojo> addCustomer(@RequestBody CustomerPojo customerPojo){
        CustomerPojo customer=customerService.insertCustomer(customerPojo);
        return ResponseEntity.ok(customer);
    }

    @GetMapping
    public ResponseEntity<List<CustomerPojo>> getAllCustomers(){
        List<CustomerPojo> customer= customerService.getAll();
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerPojo> updateCustomer(@PathVariable Long id, @RequestBody CustomerPojo customerPojo){
        CustomerPojo customer=customerService.updateCustomer(id,customerPojo);
        return ResponseEntity.ok(customer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id){
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerPojo> getCustomerById(@PathVariable Long id){
        CustomerPojo cus=customerService.getCustomer(id);
        return ResponseEntity.ok(cus);
    }

}
