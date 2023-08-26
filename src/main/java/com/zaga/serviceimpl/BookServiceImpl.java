package com.zaga.serviceimpl;
import java.util.List;

import com.zaga.entity.BookDetails;
import com.zaga.repository.BookRepo;
import com.zaga.service.BookService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
@ApplicationScoped
public class BookServiceImpl implements BookService {
    @Inject
    private BookRepo bookRepo;
    @Transactional
    @Override
    public Response addByBooks(BookDetails bookDetails) {
       try {
        bookRepo.persist(bookDetails);
        return Response.status(201).entity(bookDetails).build();
       } catch (Exception e) {
        e.printStackTrace();
        return Response.status(400).entity(e.getMessage()).build();
       }
    }
    @Override
    public Response getBooks() {
       try {
        List<BookDetails> bookDetails1=bookRepo.findAll().list();
        return Response.status(200).entity(bookDetails1).build();
       } catch (Exception e) {
         e.printStackTrace();
        return Response.status(400).entity(e.getMessage()).build();
       }
    }
    /**
     * 
     * 
     */
    @Override
    public Response getFindName(String name) {
       try {
        BookDetails bookDetails=bookRepo.findBookName(name);
        return Response.status(200).entity(bookDetails).build();
       } catch (Exception e) {
       e.printStackTrace();
        return Response.status(400).entity(e.getMessage()).build();
        }
    }
    @Override
    public Response findBookId(Long bookId) {
     try {
    BookDetails bookDetails=bookRepo.findBookId(bookId);
    return Response.status(200).entity(bookDetails).build();
     } catch (Exception e) {
     e.printStackTrace();
     return Response.status(440).entity(e.getMessage()).build();
     }
    }
    @Override
    public Response updateAuthor(Long bookId,String author) {
        try {

       BookDetails bookDetails=bookRepo.updateAuthor(bookId,author);
       bookDetails.setAuthor(author);
       return Response.status(200).entity(bookDetails).build();
        }
         catch (Exception e) {
           e.printStackTrace();
           return Response.status(400).entity(e.getMessage()).build();
        }
    }
    @Override
    public Response deleteName(String name) {
        try {
            BookDetails bookDetails=bookRepo.deleteName(name);
            bookDetails.delete();
            return Response.status(200).entity(bookDetails).build();
        } catch (Exception e) {
          e.printStackTrace();
          return Response.status(400).entity(e.getMessage()).build();
        }

      
    }
   
}

