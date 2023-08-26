package com.zaga.repository;
import com.zaga.entity.BookDetails;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

import jakarta.enterprise.context.ApplicationScoped;
@ApplicationScoped
public class BookRepo implements PanacheRepository<BookDetails>{
    public BookDetails findBookName(String name){
       return find("name=?1",name).singleResult();
    }
    public  BookDetails findBookId(Long bookId){
        return find("bookId=?1",bookId).singleResult();
    }
    public BookDetails updateAuthor(Long bookId,String author){
        return find("bookId=?1",bookId).singleResult();
    }
    public BookDetails deleteName(String name){
        return find("name=?1",name).singleResult();
    }
}
