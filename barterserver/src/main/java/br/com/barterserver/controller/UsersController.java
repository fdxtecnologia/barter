/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.PictureDAO;
import br.com.barterserver.dao.UserDAO;
import br.com.barterserver.login.Public;
import br.com.barterserver.login.UserSession;
import br.com.barterserver.model.Picture;
import br.com.barterserver.model.Role;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;
import com.google.gson.Gson;
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
        if(isValid(user)){
            dao.saveOrUpdate(user);
        }else{
            result.include("errors","Not able to sign up the user");
        }
    }
    
    @Post("user/post/mypictures")
    public void listMyPictures(User user){
       List<Picture> myPics = user.getPictures();
       result.use(Results.json()).withoutRoot().from(myPics).serialize();
    }
    
    @Post("user/post/picture/add")
    public void addPicture(Picture picture, User user){
            if(picture.getId() != null){
                List<Picture> pictures = user.getPictures();
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
