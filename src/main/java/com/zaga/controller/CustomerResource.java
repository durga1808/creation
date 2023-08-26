package com.zaga.controller;


import com.zaga.entity.UserDetails;
import com.zaga.service.CustomerService;

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

@Path("/auth")
public class CustomerResource {

    @Inject
    private CustomerService customerService;

    @GET
    @Path("/getUser")
    @Produces(MediaType.APPLICATION_JSON)
     @Consumes(MediaType.APPLICATION_JSON)
    public Response getUser(@QueryParam("username") String username, @QueryParam("password") String password) {

              UserDetails userDetails = new UserDetails(username,password,"","");
              userDetails.setUsername(username);
        userDetails.setPassword(password);

        // Return the UserDetails object in the response body
        return Response.ok(userDetails).build();
        //Response result = customerService.registerUser(userDetails);
        //return result;
        }


    @POST
    @Path("/createUser/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(@PathParam("username") String username, @QueryParam("password") String password,
            @QueryParam("city") String city, @QueryParam("state") String state) {
        UserDetails userDetails = new UserDetails(username, password, city, state);
        Response result = customerService.registerUser(userDetails);
        return result;
    }
      
}
