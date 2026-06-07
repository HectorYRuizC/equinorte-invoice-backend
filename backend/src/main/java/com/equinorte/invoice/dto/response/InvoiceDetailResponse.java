package com.equinorte.invoice.dto.response;

import java.math.BigDecimal;

public record InvoiceDetailResponse(
        String productName,
        BigDecimal price,
        BigDecimal iva,
        BigDecimal total
) {}
