package com.example.demoERP.dto;

import com.example.demoERP.pojo.ProductsPojo;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter

public class SalesItemRequestDto {

    private Long productId;
    private Integer quantity;
    private BigDecimal taxPercent;
    private BigDecimal unitPrice;

}
