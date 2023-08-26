package com.zaga.service;

import com.zaga.entity.ProductDetails;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public interface ProductService {
    
    public Response Product(ProductDetails productDetails);
     public Response getByProductName(String name);
       public Response getProductId(Long productid);
       Response updateProduct(Long productId,Double price);
       Response getProducts();
       Response updateName(Long productId,String name);
       Response deleteId(Long productId);
       Response deleteName(String name);
       
      //  Response updateProductDetails(Long productId);

}
