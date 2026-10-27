package com.example.demoERP.controller;

import com.example.demoERP.pojo.RolePojo;
import com.example.demoERP.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/erp/role")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping
    public ResponseEntity<RolePojo> insertRole(@RequestBody RolePojo role) {
        RolePojo newRole = roleService.insertRole(role);
        return ResponseEntity.ok(newRole);
    }
    @GetMapping
    public List<RolePojo> getAllRoles(){
        return roleService.getAllRoles();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RolePojo> updateRole(@RequestBody RolePojo role, @PathVariable Long id){
        RolePojo updatedRole = roleService.updateRole(role, id);
        return ResponseEntity.ok(updatedRole);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id){
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
