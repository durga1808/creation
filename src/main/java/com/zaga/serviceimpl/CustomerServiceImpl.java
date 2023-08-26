package com.zaga.serviceimpl;

import com.zaga.entity.UserDetails;
import com.zaga.repository.CustomerRepo;
import com.zaga.service.CustomerService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class CustomerServiceImpl implements CustomerService {

    @Inject
    private CustomerRepo customerRepo;

    @Transactional
    @Override
    public Response registerUser(UserDetails userDetails) {
        try {
            customerRepo.persist(userDetails);
            return Response.status(201).entity(userDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(400).entity(e.getMessage()).build();
        }
    }

}
