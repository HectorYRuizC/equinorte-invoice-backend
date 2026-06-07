package com.equinorte.invoice.service;

import com.equinorte.invoice.dto.request.InvoiceDetailRequest;
import com.equinorte.invoice.dto.request.InvoiceRequest;
import com.equinorte.invoice.dto.request.RecalculateRequest;
import com.equinorte.invoice.dto.response.InvoiceDetailResponse;
import com.equinorte.invoice.dto.response.InvoiceResponse;
import com.equinorte.invoice.dto.response.InvoiceSummaryResponse;
import com.equinorte.invoice.dto.response.RecalculateResponse;
import com.equinorte.invoice.entity.Invoice;
import com.equinorte.invoice.entity.InvoiceDetail;
import com.equinorte.invoice.enums.UserType;
import com.equinorte.invoice.exception.BusinessException;
import com.equinorte.invoice.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository repository;
    private static final BigDecimal IVA_RATE = new BigDecimal("0.19");


    public InvoiceResponse create(InvoiceRequest request) {

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalIva = BigDecimal.ZERO;

        List<InvoiceDetail> details = new ArrayList<>();
        List<InvoiceDetailResponse> responseDetails = new ArrayList<>();

        for (InvoiceDetailRequest d : request.details()) {

            BigDecimal iva = d.price().multiply(IVA_RATE);
            BigDecimal total = d.price().add(iva);

            subtotal = subtotal.add(d.price());
            totalIva = totalIva.add(iva);

            InvoiceDetail entity = new InvoiceDetail();
            entity.setProductName(d.productName());
            entity.setPrice(d.price());
            entity.setIva(iva);
            entity.setTotal(total);

            details.add(entity);

            responseDetails.add(new InvoiceDetailResponse(
                    d.productName(),
                    d.price(),
                    iva,
                    total
            ));
        }

        BigDecimal finalTotal = subtotal.add(totalIva);

        Invoice invoice = new Invoice();
        invoice.setSubtotal(subtotal);
        invoice.setTotalIva(totalIva);
        invoice.setTotal(finalTotal);

        details.forEach(d -> d.setInvoice(invoice));
        invoice.setDetails(details);

        repository.save(invoice);

        return new InvoiceResponse(
                invoice.getId(),
                subtotal,
                totalIva,
                finalTotal,
                responseDetails
        );
    }


    public InvoiceResponse getById(Long id) {
        Invoice invoice = repository.findById(id)
                .orElseThrow(() -> new BusinessException("Invoice not found"));

        return mapToResponse(invoice);
    }



    private RecalculationResult calculateInvoice(Invoice invoice, BigDecimal newSubtotal, boolean applyChanges) {

        BigDecimal oldSubtotal = invoice.getSubtotal();
        BigDecimal factor = newSubtotal.divide(oldSubtotal, 4, RoundingMode.HALF_UP);

        List<InvoiceDetailResponse> responseDetails = new ArrayList<>();
        BigDecimal totalIva = BigDecimal.ZERO;

        for (InvoiceDetail d : invoice.getDetails()) {

            BigDecimal newPrice = d.getPrice().multiply(factor);
            BigDecimal iva = newPrice.multiply(IVA_RATE);
            BigDecimal total = newPrice.add(iva);

            totalIva = totalIva.add(iva);

            if (applyChanges) {
                d.setPrice(newPrice);
                d.setIva(iva);
                d.setTotal(total);
            }

            responseDetails.add(new InvoiceDetailResponse(
                    d.getProductName(),
                    newPrice,
                    iva,
                    total
            ));
        }

        BigDecimal finalTotal = newSubtotal.add(totalIva);

        return new RecalculationResult(totalIva, finalTotal, responseDetails);
    }



    public RecalculateResponse recalculate(RecalculateRequest request) {

        Invoice invoice = repository.findById(request.invoiceId())
                .orElseThrow(() -> new BusinessException("Invoice not found"));

        BigDecimal oldSubtotal = invoice.getSubtotal();
        BigDecimal newSubtotal = request.newSubtotal();

        validateUserLimit(request.userType(), oldSubtotal, newSubtotal);

        RecalculationResult result = calculateInvoice(invoice, newSubtotal, false);

        return new RecalculateResponse(
                oldSubtotal,
                newSubtotal,
                result.totalIva(),
                result.finalTotal(),
                result.details()
        );
    }


    public InvoiceResponse applyRecalculation(RecalculateRequest request) {

        Invoice invoice = repository.findById(request.invoiceId())
                .orElseThrow(() -> new BusinessException("Invoice not found"));

        BigDecimal oldSubtotal = invoice.getSubtotal();
        BigDecimal newSubtotal = request.newSubtotal();

        validateUserLimit(request.userType(), oldSubtotal, newSubtotal);

        RecalculationResult result = calculateInvoice(invoice, newSubtotal, true);

        invoice.setSubtotal(newSubtotal);
        invoice.setTotalIva(result.totalIva());
        invoice.setTotal(result.finalTotal());

        repository.save(invoice);

        return mapToResponse(invoice);
    }



    private void validateUserLimit(UserType userType, BigDecimal oldSubtotal, BigDecimal newSubtotal) {

        BigDecimal increase = newSubtotal.subtract(oldSubtotal);


        if (increase.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        BigDecimal limit = switch (userType) {
            case TYPE_A -> new BigDecimal("20000");
            case TYPE_B -> new BigDecimal("50000");
        };

        if (increase.compareTo(limit) > 0) {
            throw new BusinessException(
                    "Increase exceeds allowed limit for user type. Max allowed: " + limit
            );
        }
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {

        List<InvoiceDetailResponse> details = invoice.getDetails().stream()
                .map(d -> new InvoiceDetailResponse(
                        d.getProductName(),
                        d.getPrice(),
                        d.getIva(),
                        d.getTotal()
                )).toList();

        return new InvoiceResponse(
                invoice.getId(),
                invoice.getSubtotal(),
                invoice.getTotalIva(),
                invoice.getTotal(),
                details
        );
    }

    public List<InvoiceSummaryResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(i -> new InvoiceSummaryResponse(
                        i.getId(),
                        i.getTotal(),
                        i.getTotalIva(),
                        i.getSubtotal()
                ))
                .toList();
    }




    private record RecalculationResult(
            BigDecimal totalIva,
            BigDecimal finalTotal,
            List<InvoiceDetailResponse> details
    ) {}


}


