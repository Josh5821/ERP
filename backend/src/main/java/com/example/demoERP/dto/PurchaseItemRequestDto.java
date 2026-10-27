package com.example.demoERP.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class PurchaseItemRequestDto {

    private Long productId;
    private BigDecimal purchasePrice;
    private Integer quantity;
    private BigDecimal taxPercent;

}
