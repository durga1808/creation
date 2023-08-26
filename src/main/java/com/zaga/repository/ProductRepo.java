package com.zaga.repository;

import com.zaga.entity.ProductDetails;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
// import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
@ApplicationScoped
public class ProductRepo implements PanacheRepository<ProductDetails> {

    public ProductDetails getProductDetailsById(Long productid) {
        return null;
    }
    
}
