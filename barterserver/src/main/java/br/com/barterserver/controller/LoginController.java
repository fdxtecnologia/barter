/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.UserDAO;
import br.com.barterserver.login.Public;
import br.com.barterserver.login.UserSession;
import br.com.barterserver.model.Role;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;

/**
 *
 * @author guilherme
 */
@Resource
@Public
public class LoginController {
    
    private Result result;
    private UserSession userSession;
    private UserDAO userDAO;
    
    public LoginController(Result result, UserSession userSession, UserDAO userDAO){
        this.result = result;
        this.userDAO = userDAO;
        this.userSession = userSession;
    }
    
    @Post("user/login")
    public void doLogin(String email, String password){
        User u = userDAO.getUserByCredentials(email, password);
        if(u !=null && u.getUserRole()==Role.ADMIN){
            userSession.setUser(u);
            
        }
    }
    
    @Post("/user/post/save")
    public void doFacebookLogin(User user) {
        User u = userDAO.getUserByCredentials(user.getEmail(), user.getPassword());
        if (u.getId() != null && u.getUserRole() == Role.USER) {
            user = userDAO.saveOrUpdateAndReturn(u);
            result.use(Results.json()).withoutRoot().from(user).serialize();
        } else {
            if(isValid(user)){
                user = userDAO.saveOrUpdateAndReturn(user);
                result.use(Results.json()).withoutRoot().from(user).serialize();
            }else{
                result.use(Results.http()).body("ERROR USER INVALID");
            }
        }
        
    }
    
    private boolean isValid(User user){
        boolean isUnique = true;
        for(User u: userDAO.findAll()){
            if(u.getEmail().equals(user.getEmail())){
                isUnique = false;
            }
        }
        
        return isUnique;
    }
    
    
}
