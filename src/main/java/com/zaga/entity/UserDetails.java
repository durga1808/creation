package com.zaga.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
// import io.quarkus.mongodb.panache.PanacheMongoEntity;
// import io.quarkus.mongodb.panache.common.MongoEntity;
import jakarta.persistence.Entity;
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
// @MongoEntity(database = "DurgaTest",collection = "UserInfo")
@Entity
public class UserDetails extends PanacheEntity {

    private String username;
    private String password;
   private String city;
    private String state;

}
