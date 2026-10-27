
package com.example.demoERP.repository;

import com.example.demoERP.pojo.PurchasePaymentPojo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PurchasePaymentRepository
        extends JpaRepository<PurchasePaymentPojo, Long> {

    @Query("""
        SELECT COALESCE(SUM(p.amountPaid), 0)
        FROM PurchasePaymentPojo p
        WHERE p.purchaseHeader.id = :purchaseId
    """)
    BigDecimal getTotalPaidByPurchaseId(
            @Param("purchaseId") Long purchaseId);

    List<PurchasePaymentPojo> findByPurchaseHeader_IdOrderByPaymentDateDescIdDesc(
            Long purchaseId
    );
}
