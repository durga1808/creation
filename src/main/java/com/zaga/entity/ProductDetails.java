package com.zaga.entity;

// import org.bson.types.ObjectId;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Entity;
// import io.quarkus.mongodb.panache.PanacheMongoEntity;
// import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
// @EqualsAndHashCode(callSuper=false)
@AllArgsConstructor
@NoArgsConstructor
// @ToString
// @JsonIgnoreProperties({"id"})
// @MongoEntity(database = "DurgaTest",collection = "ProductInfo")
@Entity
public class ProductDetails extends PanacheEntity {
    // private ObjectId id;
   
    private String name;
    private Double price;
    private Long productid;

}

