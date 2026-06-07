package com.equinorte.invoice.dto.response;

public record FieldErrorResponse(
        String field,
        String message
) {}