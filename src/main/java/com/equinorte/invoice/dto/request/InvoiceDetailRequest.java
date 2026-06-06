package com.equinorte.invoice.dto.request;

import java.math.BigDecimal;

public record InvoiceDetailRequest(
        String productName,
        BigDecimal price
) {}
