package com.example.demoERP.repository;

import com.example.demoERP.pojo.ProductsPojo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository
        extends JpaRepository<ProductsPojo, Long> {
}