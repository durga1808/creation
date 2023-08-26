package com.zaga.controller;

import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;

import com.zaga.entity.ProductDetails;
import com.zaga.service.ProductService;
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


@Path("/read")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {
   
   
   @Inject
   private ProductService productService;

   @GET
    @Path("/findname/{name}")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     public Response getname(@PathParam("name") String name){
        Response result=productService.getByProductName(name);
        return result;
     }

   @GET
    @Path("/getProducts")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     public Response getProducts(){
        Response result=productService.getProducts();
        return result;
     }
     


   //   @POST
   //  @Path("/post/{name}")
   //  @Consumes(MediaType.APPLICATION_JSON)
   //  @Produces(MediaType.APPLICATION_JSON)
   //  public Response addProduct(@PathParam("name") String name, @QueryParam("price") Double price,  @QueryParam("productid") Long productid) {
   //      ProductDetails productDetails = new ProductDetails(name, price,productid);
   //      Response result = productService.Product(productDetails);
   //      return result;
   //  }


   @Transactional
   @POST
   @Path("/post")
   @Consumes(MediaType.APPLICATION_JSON)
   @Produces(MediaType.APPLICATION_JSON)
   public ProductDetails addProduct(@RequestBody ProductDetails productDetails){
      ProductDetails.persist(productDetails);
      return productDetails;

   }



      @GET
      @Path("/findid/{productid}")
      @Consumes(MediaType.APPLICATION_JSON)
      @Produces(MediaType.APPLICATION_JSON)
      public Response getId(@PathParam("productid") Long productid){
        Response result=productService.getProductId(productid);
        return result;
      }

      @Transactional
      @PUT
      @Path("/updatePrice/{productId}")
      @Consumes(MediaType.APPLICATION_JSON)
      @Produces(MediaType.APPLICATION_JSON)
      public Response updatePrice(@PathParam("productId") Long productId, @QueryParam("price") Double price){
         Response ps = productService.updateProduct(productId, price);
         return ps;
      }

      @Transactional
      @PUT
      @Path("/updateName/{productId}")
      @Consumes(MediaType.APPLICATION_JSON)
      @Produces(MediaType.APPLICATION_JSON)
      public Response updateProductByName(@PathParam("productId") Long ProductId, @QueryParam("name")String name){
        Response result=productService.updateName(ProductId, name);
        return result;
      }

      // @Transactional
      // @PUT
      // @Path("/updateAll/{productId}")
      // @Consumes(MediaType.APPLICATION_JSON)
      // @Produces(MediaType.APPLICATION_JSON)
      // public Response updateAll(@QueryParam("id") Long id, @PathParam("productId") Long productId){
      //    Response result=productService.updateProductDetails(id, productId);
      //    return result;
      // }

      @DELETE
      @Path("/deleteid/{productId}")
      @Consumes(MediaType.APPLICATION_JSON)
      @Produces(MediaType.APPLICATION_JSON)
      public Response removeName(@PathParam("productId") Long productId){
         Response result=productService.deleteId(productId);
            return result;
      }
      @DELETE
      @Path("/deletename/{name}")
      @Consumes(MediaType.APPLICATION_JSON)
      @Produces(MediaType.APPLICATION_JSON)
      public Response deleteName(@PathParam("name") String name){
         Response result=productService.deleteName(name);
         return result;
      
      }

   }