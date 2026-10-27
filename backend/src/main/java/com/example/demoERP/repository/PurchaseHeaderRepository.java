package com.example.demoERP.repository;

import com.example.demoERP.pojo.PurchaseHeaderPojo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseHeaderRepository extends JpaRepository<PurchaseHeaderPojo, Long> {
}
