package com.example.demoERP.repository;

import com.example.demoERP.pojo.PurchaseItemPojo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItemPojo,Long> {
}
