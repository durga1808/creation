package com.zaga.controller;

import com.zaga.entity.EmployeeDetails;
import com.zaga.service.EmployeeService;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/read")
public class EmployeeResource {

    @Inject
    private EmployeeService empService;

    @GET
    @Path("/getDetails")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getUser() {

        // empDetails.setName(name);
        // empDetails.setAddress(address); ;
        // return Response.ok(empDetails).build();
        // Response result = customerService.registerUser(userDetails);
        // return result;
        Response result = empService.getUser();
        return result;
    }

    @POST
    @Path("/add/{name}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response add(@PathParam("name") String name, @QueryParam("address") String address) {
        EmployeeDetails empDetails = new EmployeeDetails(name, address);
        Response result = empService.Employee(empDetails);
        return result;
    }


    @GET
    @Path("/findbyname/{name}")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     public Response getbyname(@PathParam("name") String name){
        Response result=empService.getByEmployeeName(name);
        return result;
     }

}
      