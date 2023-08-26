package com.zaga.service;

import com.zaga.entity.UserDetails;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public interface CustomerService {
    
    public Response registerUser(UserDetails userDetails);

}
