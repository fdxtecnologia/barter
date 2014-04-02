/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

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
    private Result result;
    private UserSession userSession;
    
    public UsersController(Result result, UserDAO dao, UserSession userSession){
        
        this.result = result;
        this.dao = dao;
        this.userSession = userSession;
        
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
    
    @Post("user/post/pictures")
    public void listPictures(){
        if (userSession.isLogged()){
            User user = userSession.getUser();
            List<Picture> userPics = user.getPictures();
            result.use(Results.json()).withoutRoot().from(userPics).serialize();
        }
    }
    
    @Post("user/post/picture/add")
    public void addPicture(Picture picture){
        if(userSession.isLogged()){
            User u = userSession.getUser();
            List<Picture> pictures = u.getPictures();
            pictures.add(picture);
            u.setPictures(pictures);
            dao.saveOrUpdate(u);
        }
    }
    
    @Post
    public void postSave(User user){
        if(isValid(user)){
            dao.saveOrUpdate(user);
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
