package com.example.demoERP.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter

public class PurchaseRequestDto {

    private  Long supplierId;
    private LocalDate purchaseDate;
    private List<PurchaseItemRequestDto> purchaseItems;
}
