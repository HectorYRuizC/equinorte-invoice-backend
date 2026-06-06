package com.equinorte.invoice.dto.request;

import com.equinorte.invoice.enums.UserType;

import java.util.List;

public record InvoiceRequest(
        List<InvoiceDetailRequest> details,
        UserType userType
) {}
