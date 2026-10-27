package com.example.demoERP.repository;

import com.example.demoERP.pojo.SupplierPojo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository
        extends JpaRepository<SupplierPojo, Long> {
}