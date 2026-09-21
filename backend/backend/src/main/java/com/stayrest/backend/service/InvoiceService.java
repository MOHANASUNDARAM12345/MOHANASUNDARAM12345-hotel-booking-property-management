package com.stayrest.backend.service;

import com.stayrest.backend.entity.Invoice;
import com.stayrest.backend.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice createInvoice(Invoice invoice) {

        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isBlank()) {
            invoice.setInvoiceNumber(
                    "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
            );
        }

        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Integer id) {
        return invoiceRepository.findById(id);
    }

    public List<Invoice> getInvoiceByPayment(Integer paymentId) {
        return invoiceRepository.findByPaymentId(paymentId);
    }

    public Invoice updateInvoice(Integer id, Invoice updated) {

        Invoice existing = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found with ID: " + id)
                );

        existing.setTotalAmount(updated.getTotalAmount());

        if (updated.getInvoiceNumber() != null
                && !updated.getInvoiceNumber().isBlank()) {
            existing.setInvoiceNumber(updated.getInvoiceNumber());
        }

        return invoiceRepository.save(existing);
    }

    public void deleteInvoice(Integer id) {
        invoiceRepository.deleteById(id);
    }
}