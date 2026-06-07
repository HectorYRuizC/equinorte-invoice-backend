package com.equinorte.invoice.entity;

import com.equinorte.invoice.enums.UserType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "invoice")
@Getter
@Setter
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private BigDecimal subtotal;

    private BigDecimal totalIva;

    private BigDecimal total;

    @OneToMany(mappedBy = "invoice",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<InvoiceDetail> details;

}
