package com.example.demoERP.repository;

import com.example.demoERP.pojo.CustomerPojo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<CustomerPojo, Long> {
}
