package com.example.demoERP.service;

import com.example.demoERP.dto.EmployeeDto;
import com.example.demoERP.pojo.EmployeePojo;
import com.example.demoERP.pojo.RolePojo;
import com.example.demoERP.repository.EmployeeRepository;
import com.example.demoERP.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepository empRepo;
    @Autowired
    RoleRepository roleRepo;
    @Autowired
    PasswordEncoder passwordEncoder;


    public EmployeePojo insertEmployeeService(EmployeeDto employeeDto) {

        System.out.println("Service method called!");

        System.out.println("Role IDs: " + employeeDto.getRoleIds());
        EmployeePojo emp=new EmployeePojo();
        emp.setFirstName(employeeDto.getFirstName());
        emp.setLastName(employeeDto.getLastName());
        emp.setEmail(employeeDto.getEmail());
        emp.setAddress(employeeDto.getAddress());
        emp.setPhoneNumber(employeeDto.getPhoneNumber());
        emp.setUsername(employeeDto.getUsername());
        emp.setPassword(passwordEncoder.encode(employeeDto.getPassword()));
        List<RolePojo> roles=roleRepo.findAllById(employeeDto.getRoleIds());
        emp.setRoles(roles);
        System.out.println(roles+"Roles");
       return empRepo.save(emp);
    }

    public List<EmployeePojo> getAllEmployee(){
        return empRepo.findAll();
    }

    public EmployeePojo updateEmployeeService(Long id, EmployeeDto employeeDto) {
        EmployeePojo emp=empRepo.findById(id).orElseThrow(()->new RuntimeException("Employee not found!"));
        emp.setFirstName(employeeDto.getFirstName());
        emp.setLastName(employeeDto.getLastName());
        emp.setEmail(employeeDto.getEmail());
        emp.setAddress(employeeDto.getAddress());
        emp.setPhoneNumber(employeeDto.getPhoneNumber());
        emp.setUsername(employeeDto.getUsername());
        List<RolePojo> roles=roleRepo.findAllById(employeeDto.getRoleIds());
        emp.setRoles(roles);
        return empRepo.save(emp);
    }

    public void deleteEmployeeService(Long id){
        empRepo.deleteById(id);

    }

    public EmployeePojo getEmployeeById(Long id){
        return empRepo.findById(id).orElseThrow(()->new RuntimeException("Employee not found!"));
    }
}
