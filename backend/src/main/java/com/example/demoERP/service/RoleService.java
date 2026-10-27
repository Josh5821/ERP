package com.example.demoERP.service;

import com.example.demoERP.pojo.RolePojo;
import com.example.demoERP.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public RolePojo insertRole(RolePojo role){
        return roleRepository.save(role);
    }

    public List<RolePojo> getAllRoles(){
        return roleRepository.findAll();
    }

    public RolePojo updateRole(RolePojo role, Long id){
        RolePojo newRole = roleRepository.findById(id).orElseThrow(()->new RuntimeException("Role not found"));
        newRole.setDescription(role.getDescription());
        newRole.setRole(role.getRole());
        return roleRepository.save(newRole);
    }

    public void deleteRole(Long id){
        roleRepository.deleteById(id);
    }


}
