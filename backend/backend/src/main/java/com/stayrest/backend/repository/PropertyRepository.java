package com.stayrest.backend.repository;

import com.stayrest.backend.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Integer> {

    List<Property> findByOwnerId(Integer ownerId);
}