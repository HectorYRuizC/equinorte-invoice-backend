package com.equinorte.invoice.dto.request;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record InvoiceRequest(
        @NotEmpty(message = "Invoice must contain at least one detail")
        List<@Valid InvoiceDetailRequest> details
) {}
