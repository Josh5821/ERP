package com.example.demoERP.pojo;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name="Sales_Header")
public class SalesHeaderPojo {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private LocalDate salesDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="customer_id", nullable=false)
    private CustomerPojo customer;

    @Column(precision = 12,scale = 2)
    private BigDecimal subtotal=BigDecimal.ZERO;

    @Column(precision = 12,scale = 2)
    private BigDecimal taxAmount=BigDecimal.ZERO;

    @Column(precision = 12,scale = 2)
    private BigDecimal totalAmount=BigDecimal.ZERO;

    @JsonIgnore
    @OneToMany(
            mappedBy = "salesHeader",

            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<SalesPaymentPojo> payments = new ArrayList<>();

    @OneToMany(mappedBy = "salesHeader",cascade = CascadeType.ALL,fetch =  FetchType.EAGER,orphanRemoval = true)
    @JsonManagedReference("sales_items")
    private List<SalesItemPojo> items=new ArrayList<>();

}
