package com.example.demoERP.dto;

import com.example.demoERP.pojo.CustomerPojo;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter

public class SalesRequestDto {

    private Long customerId;
    private LocalDate salesDate;
    private List<SalesItemRequestDto> items;
}
