package com.zaga.serviceimpl;

import java.util.List;

import com.zaga.entity.EmployeeDetails;
import com.zaga.repository.EmployeeRepo;
import com.zaga.service.EmployeeService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class EmployeeServiceimpl implements EmployeeService {

    @Inject
    private EmployeeRepo EmployeeRepo;

    @Override
    public Response Employee(EmployeeDetails empDetails) {
        try {
            EmployeeRepo.persist(empDetails);
            return Response.status(201).entity(empDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(400).entity(e.getMessage()).build();
        }
    }



    @Override
    public Response getUser() {
         try{

            List<EmployeeDetails> employeeDetails = EmployeeRepo.findAll().list();
       
            return Response.status(201).entity(employeeDetails).build();
        }
        catch(Exception e) {
             e.printStackTrace();
            return Response.status(400).entity(e.getMessage()).build();
        }
    }



    @Override
    public Response getByEmployeeName(String name) {
       try {
    EmployeeDetails employeeDetails=EmployeeRepo.find("name=?1",name).singleResult();
     return Response.status(201).entity(employeeDetails).build();
       } catch (Exception e) {
        e.printStackTrace();
         return Response.status(400).entity(e.getMessage()).build();
       }
    }

}