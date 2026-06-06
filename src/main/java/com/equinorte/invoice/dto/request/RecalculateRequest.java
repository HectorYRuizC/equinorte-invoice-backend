package com.equinorte.invoice.dto.request;

import com.equinorte.invoice.enums.UserType;

import java.math.BigDecimal;

public record RecalculateRequest(
        Long invoiceId,
        BigDecimal newSubtotal,
        UserType userType
) {}