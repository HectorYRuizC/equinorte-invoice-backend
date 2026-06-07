package com.equinorte.invoice.dto.request;

import com.equinorte.invoice.enums.UserType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RecalculateRequest(
        @NotNull(message = "Invoice ID is required")
        Long invoiceId,
        @NotNull(message = "New subtotal is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Subtotal must be greater than 0")
        BigDecimal newSubtotal,
        @NotNull(message = "User type is required")
        UserType userType
) {}