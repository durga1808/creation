package com.zaga.serviceimpl;

import com.zaga.service.ProductService;



import com.zaga.entity.ProductDetails;
import com.zaga.repository.ProductRepo;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
@ApplicationScoped
public class ProductServiceImpl implements ProductService{

    @Inject
    private ProductRepo productRepo;

    @Transactional
    @Override
    public Response Product(ProductDetails productDetails) {
        try {
            productRepo.persist(productDetails);
            return Response.status(201).entity(productDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(400).entity(e.getMessage()).build();
        }
    }
    @Override
    public Response getByProductName(String name) {
          try {
    ProductDetails productDetails=productRepo.find("name=?1",name).singleResult();
     return Response.status(201).entity(productDetails).build();
       } catch (Exception e) {
        e.printStackTrace();
         return Response.status(400).entity(e.getMessage()).build();
       }
    }
    @Override
    public Response getProductId(Long productid) {
        try {
            ProductDetails productDetails = productRepo.find("productid=?1",productid).singleResult();
            if (productDetails == null) {
                return Response.status(404).entity(productDetails).build();
            }
            return Response.status(200).entity(productDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e.getMessage()).build();
        }
    }

    @Override
    public Response updateProduct(Long productId , Double price){
        try {
            ProductDetails productDetails = productRepo.find("productid=?1",productId).singleResult();
            productDetails.setPrice(price);
            // ProductDetails.update(productDetails);
            return Response.status(200).entity(productDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e.getMessage()).build();
        }
    }
    @Override
    public Response getProducts() {
        
        try {
            java.util.List<ProductDetails> productDetails = productRepo.findAll().list();
            return Response.status(200).entity(productDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e.getMessage()).build();
        }
    }
    
    @Override
    public Response updateName(Long productId, String name) {
          try {
            ProductDetails productDetails = productRepo.find("productid=?1",productId).singleResult();
            // productDetails.setName(name);
            productDetails.setName(name);
            // ProductDetails.update(productDetails);
            return Response.status(200).entity(productDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e.getMessage()).build();
        }
    }

    @Override
    public Response deleteId(Long productId) {
         try {
            ProductDetails productDetails = productRepo.find("productid=?1",productId).singleResult();
            productDetails.delete();
            
            return Response.status(200).entity(productDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e.getMessage()).build();
        }
    }
    @Override
    public Response deleteName(String name) {
    try {
            ProductDetails productDetails = productRepo.find("name=?1",name).singleResult();
            productDetails.delete();
            
            return Response.status(200).entity(productDetails).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e.getMessage()).build();
        }
    }

    // @Override
    // public Response updateProductDetails(Long productId) {
    //      try {
    //         ProductDetails productDetails1 = productRepo.find("productid=?1",productId).firstResult();
    //          // productDetails.setName(name);
    //         //  productDetails1.setPrice(pri
    //         // ProductDetails details= productDetails;
    //         // details.setId(productDetails1.getId());

            
    //         // ProductDetails.update(details);
    //         return Response.status(200).entity(productDetails1).build();
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //         return Response.status(500).entity(e.getMessage()).build();
    //     }
    // }
    
   
    }

    
    
    
    
    
 

