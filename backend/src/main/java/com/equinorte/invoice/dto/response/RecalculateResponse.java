package com.equinorte.invoice.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record RecalculateResponse(
        BigDecimal oldSubtotal,
        BigDecimal newSubtotal,
        BigDecimal iva,
        BigDecimal total,
        List<InvoiceDetailResponse> details
) {}