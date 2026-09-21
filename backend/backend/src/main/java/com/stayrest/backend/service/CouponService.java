package com.stayrest.backend.service;

import com.stayrest.backend.entity.Coupon;
import com.stayrest.backend.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    // CREATE COUPON
    public Coupon createCoupon(Coupon coupon) {

        if (coupon.getCode() == null || coupon.getCode().isBlank()) {
            throw new IllegalArgumentException("Coupon code cannot be empty");
        }

        if (couponRepository.existsByCode(coupon.getCode())) {
            throw new IllegalArgumentException(
                    "Coupon with code '" + coupon.getCode() + "' already exists"
            );
        }

        if (coupon.getIsActive() == null) {
            coupon.setIsActive(true);
        }

        return couponRepository.save(coupon);
    }

    // GET ALL COUPONS
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    // GET COUPON BY ID
    public Optional<Coupon> getCouponById(Integer id) {
        return couponRepository.findById(id);
    }

    // GET COUPON BY CODE
    public Optional<Coupon> getCouponByCode(String code) {
        return couponRepository.findByCode(code);
    }

    // UPDATE COUPON
    public Coupon updateCoupon(Integer id, Coupon updated) {

        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Coupon not found with ID: " + id)
                );

        if (updated.getCode() == null || updated.getCode().isBlank()) {
            throw new IllegalArgumentException("Coupon code cannot be empty");
        }

        existing.setCode(updated.getCode());
        existing.setDiscountPercentage(updated.getDiscountPercentage());
        existing.setMaxDiscount(updated.getMaxDiscount());
        existing.setMinBookingAmount(updated.getMinBookingAmount());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setIsActive(updated.getIsActive());

        return couponRepository.save(existing);
    }

    // DELETE COUPON
    public void deleteCoupon(Integer id) {
        couponRepository.deleteById(id);
    }
}