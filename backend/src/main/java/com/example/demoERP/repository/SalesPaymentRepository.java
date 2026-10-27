package com.example.demoERP.repository;

import com.example.demoERP.pojo.SalesPaymentPojo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesPaymentRepository extends JpaRepository<SalesPaymentPojo,Long> {
    List<SalesPaymentPojo> findBySalesHeader_Id(Long saleId);
}
