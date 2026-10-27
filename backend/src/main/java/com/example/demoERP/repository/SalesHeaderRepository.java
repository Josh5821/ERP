package com.example.demoERP.repository;

import com.example.demoERP.pojo.SalesHeaderPojo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesHeaderRepository extends JpaRepository<SalesHeaderPojo, Long> {
}
