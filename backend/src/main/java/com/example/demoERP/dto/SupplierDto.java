package com.example.demoERP.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class SupplierDto {
    private String supplierName;
    private String description;
    private String address;
    private String email;
    private String phone;
    private List<Long> productIds;
}