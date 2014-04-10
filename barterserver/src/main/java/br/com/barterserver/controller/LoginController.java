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
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.core.RequestInfo;
import br.com.caelum.vraptor.http.route.Router;
import br.com.caelum.vraptor.resource.HttpMethod;
import br.com.caelum.vraptor.view.Results;
import com.google.gson.Gson;
import java.util.Set;

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
    private RequestInfo requestInfo;
    private Router router;
    
    public LoginController(Result result, UserSession userSession, UserDAO userDAO, RequestInfo requestInfo, Router router){
        this.result = result;
        this.userDAO = userDAO;
        this.userSession = userSession;
        this.requestInfo = requestInfo;
        this.router = router;
    }
    
    @Post("user/login")
    public void doLogin(String email, String password){
        User u = userDAO.getUserByCredentials(email, password);
        if(u !=null && u.getUserRole()==Role.ADMIN){
            userSession.setUser(u);
            
        }
    }
    
    @Path("/user/post/save")
    public void doFacebookLogin(User user) {
        User u = userDAO.getUserByCredentials(user.getEmail(), user.getPassword());
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin"); 
        if (u != null) {
            u.setLoc_lat(user.getLoc_lat());
            u.setLoc_long(user.getLoc_long());
            user = userDAO.saveOrUpdateAndReturn(u);
            result.use(Results.json()).withoutRoot().from(user).serialize();
        } else {
            if(isValid(user)){
                user.setUserRole(Role.USER);
                user = userDAO.saveOrUpdateAndReturn(user);
                result.use(Results.json()).withoutRoot().from(user).serialize();
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
