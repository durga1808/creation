package com.zaga.repository;

import com.zaga.entity.EmployeeDetails;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
// import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EmployeeRepo implements PanacheRepository<EmployeeDetails> {
    
}