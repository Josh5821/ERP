package com.example.demoERP.pojo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "Suppliers")
public class SupplierPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String supplierName;
    private String description;
    private String address;
    private String email;
    private String phone;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "supplier_product",
            joinColumns = @JoinColumn(name="supplier_id"),
            inverseJoinColumns = @JoinColumn(name="product_id")
    )
    private List<ProductsPojo> products;
}
