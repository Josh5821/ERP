package com.example.demoERP.service;


import com.example.demoERP.pojo.CustomerPojo;
import com.example.demoERP.pojo.EmployeePojo;
import com.example.demoERP.repository.CustomerRepository;
import com.example.demoERP.repository.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerService {

    private CustomerRepository customerRepository;
    private EmployeeRepository employeeRepository;

    public CustomerPojo insertCustomer(CustomerPojo customerPojo){

        if(customerPojo.getEmployee()!=null && customerPojo.getEmployee().getId()!=null){
            EmployeePojo employee = employeeRepository.findById(customerPojo.getEmployee().getId())
                    .orElseThrow(()-> new RuntimeException("Employee not found"));
            customerPojo.setEmployee(employee);
        }
        else{
            customerPojo.setEmployee(null);
        }
        CustomerPojo cus=customerRepository.save(customerPojo);
        return cus;
    }

    public List<CustomerPojo> getAll(){
        return customerRepository.findAll();
    }

    public CustomerPojo updateCustomer(Long id,CustomerPojo customerPojo){
        if(customerPojo.getEmployee()!=null && customerPojo.getEmployee().getId()!=null){
            EmployeePojo employeePojo = employeeRepository.findById(customerPojo.getEmployee().getId())
                    .orElseThrow(()-> new RuntimeException("Employee not found"));
            customerPojo.setEmployee(employeePojo);

        }
        else{
            customerPojo.setEmployee(null);
        }
        CustomerPojo cus=customerRepository.save(customerPojo);
        return cus;
    }

    public void deleteCustomer(Long id){
        customerRepository.deleteById(id);
    }

    public CustomerPojo getCustomer(Long id){
        return customerRepository.findById(id).orElseThrow(()-> new RuntimeException("Customer not found"));
    }
}
