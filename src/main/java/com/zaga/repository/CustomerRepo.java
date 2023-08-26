package com.zaga.repository;

import com.zaga.entity.UserDetails;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
// import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CustomerRepo implements PanacheRepository<UserDetails> {
    
}
