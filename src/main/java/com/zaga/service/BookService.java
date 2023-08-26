package com.zaga.service;

import com.zaga.entity.BookDetails;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public interface BookService {
    Response addByBooks(BookDetails bookDetails);
    Response getBooks();
    Response getFindName(String name);
    Response findBookId(Long bookId);
    Response updateAuthor(Long bookId,String author);
    Response deleteName(String name);
}
