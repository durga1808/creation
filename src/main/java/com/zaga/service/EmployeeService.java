package com.zaga.service;
import com.zaga.entity.EmployeeDetails;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public interface EmployeeService  {
    public Response Employee(EmployeeDetails empDetails);
    public Response getUser();
    public Response getByEmployeeName(String name);
    
}