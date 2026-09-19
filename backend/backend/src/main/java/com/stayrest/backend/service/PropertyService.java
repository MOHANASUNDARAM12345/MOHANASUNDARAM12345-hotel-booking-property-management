package com.stayrest.backend.service;

import com.stayrest.backend.entity.Property;
import com.stayrest.backend.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Create property
    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    // Get all properties
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Get property by ID
    public Optional<Property> getPropertyById(Integer propertyId) {
        return propertyRepository.findById(propertyId);
    }

    // Get properties by owner
    public List<Property> getPropertiesByOwner(Integer ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }

    // Update property
    public Property updateProperty(Integer propertyId, Property updatedProperty) {

        Property existingProperty = propertyRepository
                .findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found"));

        existingProperty.setPropertyName(
                updatedProperty.getPropertyName()
        );

        existingProperty.setPropertyType(
                updatedProperty.getPropertyType()
        );

        existingProperty.setDescription(
                updatedProperty.getDescription()
        );

        existingProperty.setAddress(
                updatedProperty.getAddress()
        );

        existingProperty.setCity(
                updatedProperty.getCity()
        );

        return propertyRepository.save(existingProperty);
    }

    // Delete property
    public void deleteProperty(Integer propertyId) {
        propertyRepository.deleteById(propertyId);
    }
}