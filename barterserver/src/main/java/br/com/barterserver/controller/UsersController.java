/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.PictureDAO;
import br.com.barterserver.dao.UserDAO;
import br.com.barterserver.model.Picture;
import br.com.barterserver.model.SearchJSON;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.core.RequestInfo;
import br.com.caelum.vraptor.http.route.Router;
import br.com.caelum.vraptor.interceptor.multipart.UploadedFile;
import br.com.caelum.vraptor.resource.HttpMethod;
import br.com.caelum.vraptor.view.Results;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

/**
 *
 * @author guilherme
 */
@Resource
public class UsersController {
    
    private UserDAO dao;
    private PictureDAO picDAO;
    private Result result;
    private Router router;
    private RequestInfo requestInfo;
    
    public UsersController(Result result, UserDAO dao, PictureDAO picDAO, Router router, RequestInfo requestInfo){
        
        this.result = result;
        this.dao = dao;
        this.requestInfo = requestInfo;
        this.router = router;
        this.picDAO = picDAO;
        
    }
    
    public void index(){
        result.include("users",dao.findAll());
    }
    
    @Path("/user/{id}")
    public void view(Long id){
        result.include("user",dao.findById(id));
    }
    
    @Path("/user/add")
    public void add(){
        
    }
    
    @Path("/user/{id}")
    public void edit(Long id){
        result.include("user",dao.findById(id));
    }
    
    @Path("/search")
    public void findTrades(String title, User currentUser){
        
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin");
        //----------------HTTP HEADER NEVER CHANGE----------------------//         
        
        List<Picture> pics = dao.searchPictures(title);
        List<SearchJSON> searchs = new ArrayList<SearchJSON>();
        
        for(Picture p: pics ){
            SearchJSON s = new SearchJSON(p.getId(), p.getTitle(), p.getPhotoURL(), p.getOwner().getId(), p.getOwner().getName(), p.getOwner().getEmail(), this.distance(p.getOwner().getLoc_lat(), p.getOwner().getLoc_long(), currentUser.getLoc_lat(), currentUser.getLoc_long()));
            searchs.add(s);
        }
        
        Collections.sort(searchs, new Comparator<SearchJSON>() {

            @Override
            public int compare(SearchJSON o1, SearchJSON o2) {
                return (int) (o1.getDistance() - o1.getDistance());
            }
    
        });
        
        result.use(Results.json()).withoutRoot().from(searchs).serialize();
        
    }
     
   public Double distance(Double targetLat, Double targetLong, Double userLat, Double userLong){
        
        Double xx = (targetLat - userLat) * (targetLat - userLat);
        Double yy = (targetLong - userLong) * (targetLong - userLong);
        
        Double distance = Math.sqrt(xx + yy);
        
        return distance;
    }
    
    @Path("/user/post/mypictures")
    public void listMyPictures(User user){
        
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin");
        //----------------HTTP HEADER NEVER CHANGE----------------------// 
        
       List<Picture> myPics = user.getPictures();
       result.use(Results.json()).withoutRoot().from(myPics).serialize();
    }
    
    @Post("/user/post/picture/add")
    public void addPicture(Picture picture, User user, UploadedFile image) throws IOException{
        
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin");
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        
            if(picture.getId() == null){
                user = dao.findById(user.getId());
                List<Picture> pictures = user.getPictures();
                picture.setOwner(user);
                pictures.add(picture);
                user.setPictures(pictures);
                String fileName = dao.uploadPictureToServer(image, picture.getId());
                if(fileName != null){
                    picture.setPhotoURL(fileName);
                    picDAO.saveOrUpdate(picture);
                    result.use(Results.http()).body("Pictures saved");
                }else{
                   result.use(Results.http()).body("Pictures wasn't able to save");
                }
            }
    }
    
}
