package com.equinorte.invoice.dto.response;

import java.math.BigDecimal;
import java.util.List;


public record InvoiceResponse(
        Long id,
        BigDecimal subtotal,
        BigDecimal totalIva,
        BigDecimal total,
        List<InvoiceDetailResponse> details
) {}
