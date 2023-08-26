package com.zaga;

import java.util.List;

import org.junit.jupiter.api.Test;

// import com.arjuna.ats.internal.jdbc.drivers.modifiers.list;
import com.zaga.entity.BookDetails;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@QuarkusTest
public class BookServiceTest {
    @Test
    void getFindId(){
        BookDetails bookDetails =  RestAssured.given().queryParam("bookId",107L)
        .when().get("/details/findId")
        .then()
        .statusCode(200)
        .extract()
        .body().as(BookDetails.class);

    }
    @Test
    void getFindName(){
        BookDetails bookDetails = RestAssured.given().queryParam("name","sfd")
        .when().get("/details/findName")
        .then()
        .statusCode(200)
        .extract()
        .body().as(BookDetails.class);

    }

    @Test
    void getBooksTest() {
        List <BookDetails> bookDetails1 = RestAssured.given()
        .when().get("/details/getDetails")
        .then()
        .statusCode(200)
        .extract()
        .body()
        .jsonPath().getList(".", BookDetails.class);
    }
    @Test
    void addBooks(){
        BookDetails bookDetails = new BookDetails();
        bookDetails.setAuthor("sgfg");
        bookDetails.setBookId(200L);
        bookDetails.setName("durga");
        bookDetails.setPrice(100D);
        BookDetails books = RestAssured.given()
        .body(bookDetails)
        .contentType(ContentType.JSON)
        .when().post("/details/addDetails")
        .then()
        .statusCode(201)
        .extract()
        .body().as(BookDetails.class);
}
    @Test
    void modifyAuthor(){
        BookDetails bookDetails=new BookDetails();
        String author = "Durgalaksh";
        RestAssured.given()
        .pathParam("bookId",105L)
        .queryParam("author", author)
        .body(bookDetails)
        .contentType(ContentType.JSON)
        .when().put("/details/modifyAuthor/{bookId}")
        .then()
        .statusCode(200)
        .extract()
        .body().as(BookDetails.class);

    }

    @Test
    void deleteName(){
        RestAssured.given()
        .queryParam("name", "sfd")
        .contentType(ContentType.JSON)
        .when().delete("/details/removeName")
        .then()
        .statusCode(200);
    }

}
