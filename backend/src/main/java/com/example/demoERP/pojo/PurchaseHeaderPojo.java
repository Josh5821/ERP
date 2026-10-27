package com.example.demoERP.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Purchase_Header")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseHeaderPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // EAGER: the purchase table always needs the supplier name, and this
    // avoids Hibernate proxy errors when the object is turned into JSON
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    @JsonIgnore
    private SupplierPojo supplier;

    private LocalDate purchaseDate;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus = "UNPAID";

    // "Managed" side of the parent/child pair: this side IS written to JSON,
    // the back-reference in PurchaseItemPojo is skipped, so there is no loop
    @OneToMany(
            mappedBy = "purchaseHeader",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<PurchaseItemPojo> items = new ArrayList<>();
}