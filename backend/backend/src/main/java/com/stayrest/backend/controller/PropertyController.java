package com.stayrest.backend.controller;

import com.stayrest.backend.entity.Property;
import com.stayrest.backend.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // Create property
    @PostMapping
    public ResponseEntity<Property> createProperty(
            @RequestBody Property property) {

        Property savedProperty =
                propertyService.createProperty(property);

        return ResponseEntity.ok(savedProperty);
    }

    // Get all properties
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {

        return ResponseEntity.ok(
                propertyService.getAllProperties()
        );
    }

    // Get property by ID
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(
            @PathVariable Integer id) {

        return propertyService.getPropertyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get properties by owner ID
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Property>> getPropertiesByOwner(
            @PathVariable Integer ownerId) {

        return ResponseEntity.ok(
                propertyService.getPropertiesByOwner(ownerId)
        );
    }

    // Update property
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable Integer id,
            @RequestBody Property property) {

        return ResponseEntity.ok(
                propertyService.updateProperty(id, property)
        );
    }

    // Delete property
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProperty(
            @PathVariable Integer id) {

        propertyService.deleteProperty(id);

        return ResponseEntity.ok(
                "Property deleted successfully"
        );
    }
}