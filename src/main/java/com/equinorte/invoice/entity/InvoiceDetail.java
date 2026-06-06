package com.equinorte.invoice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_details")
@Getter
@Setter
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String productName;

    private BigDecimal price;

    private BigDecimal iva;

    private BigDecimal total;


    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

}

