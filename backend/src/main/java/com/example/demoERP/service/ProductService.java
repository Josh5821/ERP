package com.example.demoERP.service;

import com.example.demoERP.pojo.ProductsPojo;
import com.example.demoERP.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public ProductsPojo insert(ProductsPojo productsPojo) {
        return productRepository.save(productsPojo);
    }

    public List<ProductsPojo> getAll() {
        return productRepository.findAll();
    }

    public ProductsPojo update(Long id,ProductsPojo productsPojo ) {
        ProductsPojo productsPojo1 = productRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Not Found"));
        productsPojo1.setProductName(productsPojo.getProductName());
        productsPojo1.setPrice(productsPojo.getPrice());
        productsPojo1.setDescription(productsPojo.getDescription());
        return productRepository.save(productsPojo1);
    }

    public void delete(Long id){
        productRepository.deleteById(id);
    }

}
