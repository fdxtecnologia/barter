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
        if (u != null && u.getUserRole() == Role.USER) {
            result.use(Results.http()).body("User signed in");
            result.forwardTo(UsersController.class).save(u);
        } else {
            result.use(Results.http()).body("User signed in and signed up!");
            result.forwardTo(UsersController.class).save(user);
        }
        
    }
    
}
