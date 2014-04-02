/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.UserDAO;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.Consumes;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;
import com.google.gson.Gson;

/**
 *
 * @author guilherme
 */
@Resource
public class UsersController {
    
    private UserDAO dao;
    private Result result;
    private Gson gson;
    
    public UsersController(Result result, UserDAO dao){
        
        this.result = result;
        this.dao = dao;
        this.gson = new Gson();
        
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
    
    @Post
    public void save(User user){
        if(isValid(user)){
            dao.saveOrUpdate(user);
        }else{
            result.include("errors","Not able to sign up the user");
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
