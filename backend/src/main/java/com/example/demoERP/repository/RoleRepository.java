package com.example.demoERP.repository;

import com.example.demoERP.pojo.RolePojo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<RolePojo,Long> {


}
