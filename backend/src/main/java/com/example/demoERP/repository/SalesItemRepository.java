package com.example.demoERP.repository;

import com.example.demoERP.pojo.SalesItemPojo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesItemRepository extends JpaRepository<SalesItemPojo,Long> {
}
