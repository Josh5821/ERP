package com.example.demoERP.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDto {
    private Long totalCustomers;
    private Long totalProducts;
    private Long totalSales;

    private BigDecimal totalSalesAmount;
    private BigDecimal totalPaymentsReceived;
    private BigDecimal outstandingBalance;
}
