package com.equinorte.invoice.dto.response;

import java.math.BigDecimal;

public record InvoiceSummaryResponse(
        Long id,
        BigDecimal total,
        BigDecimal totalIva,
        BigDecimal subtotal
) {}