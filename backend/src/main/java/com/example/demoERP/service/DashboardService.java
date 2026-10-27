package com.example.demoERP.service;

import com.example.demoERP.dto.DashboardSummaryDto;
import com.example.demoERP.pojo.SalesHeaderPojo;
import com.example.demoERP.repository.CustomerRepository;
import com.example.demoERP.repository.ProductRepository;
import com.example.demoERP.repository.SalesHeaderRepository;
import com.example.demoERP.repository.SalesPaymentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final SalesHeaderRepository salesHeaderRepository;
    private final SalesPaymentRepository salesPaymentRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryDto getSummary() {

        // 1. Total customers
        Long totalCustomers = customerRepository.count();

        // 2. Total products
        Long totalProducts = productRepository.count();

        // 3. Get all sales
        List<SalesHeaderPojo> sales =
                salesHeaderRepository.findAll();

        Long totalSales = (long) sales.size();

        BigDecimal totalSalesAmount = BigDecimal.ZERO;
        BigDecimal totalPaymentsReceived = BigDecimal.ZERO;
        BigDecimal outstandingBalance = BigDecimal.ZERO;

        // 4. Calculate sales and outstanding balances
        for (SalesHeaderPojo sale : sales) {

            BigDecimal saleAmount = sale.getTotalAmount();

            if (saleAmount == null) {
                saleAmount = BigDecimal.ZERO;
            }

            totalSalesAmount =
                    totalSalesAmount.add(saleAmount);

            // Payments recorded for this particular sale
            BigDecimal salePayments = salesPaymentRepository
                    .findBySalesHeader_Id(sale.getId())
                    .stream()
                    .map(payment -> payment.getAmount())
                    .filter(amount -> amount != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            totalPaymentsReceived =
                    totalPaymentsReceived.add(salePayments);

            // Do not count negative balances as outstanding
            BigDecimal balance =
                    saleAmount.subtract(salePayments);

            if (balance.compareTo(BigDecimal.ZERO) > 0) {
                outstandingBalance =
                        outstandingBalance.add(balance);
            }
        }

        // 5. Return dashboard data
        return new DashboardSummaryDto(
                totalCustomers,
                totalProducts,
                totalSales,
                totalSalesAmount,
                totalPaymentsReceived,
                outstandingBalance
        );
    }
}