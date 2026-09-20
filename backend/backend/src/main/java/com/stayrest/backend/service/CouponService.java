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

    public Coupon createCoupon(Coupon coupon) {
        if (coupon.getCode() == null || coupon.getCode().isBlank()) {
            throw new IllegalArgumentException("Coupon code cannot be empty");
        }
        if (couponRepository.existsByCode(coupon.getCode())) {
            throw new IllegalArgumentException("Coupon with code '" + coupon.getCode() + "' already exists");
        }
        if (coupon.getIsActive() == null) {
            coupon.setIsActive(true);
        }
        return couponRepository.save(coupon);
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Optional<Coupon> getCouponById(Integer id) {
        return couponRepository.findById(id);
    }

    public Optional<Coupon> getCouponByCode(String code) {
        return couponRepository.findByCode(code);
    }

    public Coupon updateCoupon(Integer id, Coupon updated) {
        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found with ID: " + id));

        existing.setDiscountPercentage(updated.getDiscountPercentage());
        existing.setMaxDiscount(updated.getMaxDiscount());
        existing.setMinBookingAmount(updated.getMinBookingAmount());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setIsActive(updated.getIsActive());

        return couponRepository.save(existing);
    }

    public void deleteCoupon(Integer id) {
        couponRepository.deleteById(id);
    }
}
