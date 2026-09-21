package com.stayrest.backend.repository;

import com.stayrest.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    List<Invoice> findByPaymentId(Integer paymentId);

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}