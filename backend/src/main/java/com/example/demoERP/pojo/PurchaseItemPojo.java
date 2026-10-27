package com.example.demoERP.pojo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Purchase_Items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseItemPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // "Back" side of the parent/child pair: skipped when writing JSON,
    // which breaks the header -> items -> header -> items loop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id", nullable = false)
    @JsonBackReference
    private PurchaseHeaderPojo purchaseHeader;

    // LAZY proxies carry extra Hibernate fields that Jackson can't serialize
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductsPojo product;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal purchasePrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal taxPercent;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal taxAmount;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal totalPrice;
}