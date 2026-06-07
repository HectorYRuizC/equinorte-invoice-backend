package com.equinorte.invoice.controller;

import com.equinorte.invoice.dto.request.InvoiceRequest;
import com.equinorte.invoice.dto.request.RecalculateRequest;
import com.equinorte.invoice.dto.response.InvoiceResponse;
import com.equinorte.invoice.dto.response.InvoiceSummaryResponse;
import com.equinorte.invoice.dto.response.RecalculateResponse;
import com.equinorte.invoice.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService service;

    @PostMapping
    public InvoiceResponse create(@RequestBody @Valid InvoiceRequest request) {
        return service.create(request);
    }

    @GetMapping("/{id}")
    public InvoiceResponse get(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping("/recalculate")
    public RecalculateResponse recalculate(@RequestBody @Valid RecalculateRequest request) {
        return service.recalculate(request);
    }

    @GetMapping
    public List<InvoiceSummaryResponse> findAll() {
        return service.findAll();
    }

}