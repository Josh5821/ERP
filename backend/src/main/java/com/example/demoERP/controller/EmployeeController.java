package com.example.demoERP.controller;

import com.example.demoERP.dto.EmployeeDto;
import com.example.demoERP.pojo.EmployeePojo;
import com.example.demoERP.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/erp/employee")
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<EmployeePojo> insertEmployee(@RequestBody EmployeeDto employeeDto) {
       EmployeePojo empPojo= employeeService.insertEmployeeService(employeeDto);
        System.out.println("Service method called!");
       return ResponseEntity.ok(empPojo);
    }

    @GetMapping
    public ResponseEntity<List<EmployeePojo>> getAllEmployees(){
        return ResponseEntity.ok(employeeService.getAllEmployee());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeePojo> updateEmployee(@RequestBody EmployeeDto employeeDto, @PathVariable Long id) {
        return ResponseEntity.ok(employeeService.updateEmployeeService(id,employeeDto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployeeService(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<EmployeePojo> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }


}
