package com.example.demoERP.pojo;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name="Sales_Item")
public class SalesItemPojo {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "sale_id", nullable = false)
   @JsonBackReference("sales_items")
   private SalesHeaderPojo salesHeader;

   @ManyToOne(fetch=FetchType.EAGER)
   @JoinColumn(name="product_id", nullable = false)
   private ProductsPojo products;

    private Integer quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal unitPrice;

    private BigDecimal taxPercent;

    @Column(precision = 12, scale = 2)
    private BigDecimal taxAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalPrice;

}
