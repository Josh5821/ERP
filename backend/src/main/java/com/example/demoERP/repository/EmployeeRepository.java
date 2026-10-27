package com.example.demoERP.repository;

import com.example.demoERP.pojo.EmployeePojo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<EmployeePojo,Long> {

   Optional <EmployeePojo> findByUsername(String username);
}
