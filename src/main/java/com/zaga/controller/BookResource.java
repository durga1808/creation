package com.zaga.controller;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;

import com.zaga.entity.BookDetails;
import com.zaga.service.BookService;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/details")
public class BookResource {
    @Inject
    private BookService bookService;

    @Transactional
    @POST
    @Path("/addDetails")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addBooks(@RequestBody BookDetails bookDetails){
        return bookService.addByBooks(bookDetails);
    }

    @GET
    @Path("/getDetails")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getBooks(){
        return bookService.getBooks();
    }
   
    @Transactional
    @GET
    @Path("/findName")
    public Response getFindname(@QueryParam("name")String name){
        return bookService.getFindName(name);
    }

    @Transactional
    @GET
    @Path("/findId")
    public Response getFindId(@QueryParam("bookId") Long bookId){
        return bookService.findBookId(bookId);
    }

    @Transactional
    @PUT
    @Path("/modifyAuthor/{bookId}")
    public Response modifyAuthor(@PathParam("bookId") Long bookId ,@QueryParam("author")String author){
        return bookService.updateAuthor(bookId,author);
    }
    @Transactional
    @DELETE
    @Path("/removeName")
    public Response deleteName(@QueryParam("name")String name){
        return bookService.deleteName(name);
    }
}
