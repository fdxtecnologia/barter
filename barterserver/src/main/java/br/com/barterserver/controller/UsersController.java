/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.PictureDAO;
import br.com.barterserver.dao.UserDAO;
import br.com.barterserver.model.Picture;
import br.com.barterserver.model.Role;
import br.com.barterserver.model.SearchJSON;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 *
 * @author guilherme
 */
@Resource
public class UsersController {
    
    private UserDAO dao;
    private PictureDAO picDAO;
    private Result result;
    
    public UsersController(Result result, UserDAO dao, PictureDAO picDAO){
        
        this.result = result;
        this.dao = dao;
        
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
    
    public void save(User user){
        user.setUserRole(Role.USER);
        User u = dao.saveOrUpdateAndReturn(user);
        if(u == null){
            result.use(Results.http()).body("ERROR");
        }else{
            result.use(Results.json()).withoutRoot().from(u).serialize();
        }
    }
    
    @Post("/search")
    public void findTrades(String title, User currentUser){
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
    
    @Post("/user/post/mypictures")
    public void listMyPictures(User user){
       List<Picture> myPics = user.getPictures();
       result.use(Results.json()).withoutRoot().from(myPics).serialize();
    }
    
    @Post("/user/post/picture/add")
    public void addPicture(Picture picture, User user){
            if(picture.getId() == null){
                user = dao.findById(user.getId());
                List<Picture> pictures = user.getPictures();
                picture.setOwner(user);
                pictures.add(picture);
                user.setPictures(pictures);
                dao.saveOrUpdate(user);
                int pictureIndex = user.getPictures().lastIndexOf(picture);
                Long pictureId = user.getPictures().get(pictureIndex).getId();
                result.use(Results.json()).withoutRoot().from(pictureId).serialize();
            }else{
               Picture updatePic = picDAO.findById(picture.getId());
               picDAO.saveOrUpdate(picture);
               result.use(Results.http()).body("Pictures saved");
            }
    }
    
    @Post
    public void postSave(User user){
        if(isValid(user)){
            dao.saveOrUpdate(user);
            User u = dao.getUserByEmail(user.getEmail());
            result.use(Results.json()).withoutRoot().from(u).serialize();
        }else{
            result.use(Results.http()).sendError(500, "Unable to create user!");
        }
    }
    
    private boolean isValid(User user){
        boolean isUnique = true;
        for(User u: dao.findAll()){
            if(u.getEmail().equals(user.getEmail())){
                isUnique = false;
            }
        }
        
        return isUnique;
    }
    
    
}
