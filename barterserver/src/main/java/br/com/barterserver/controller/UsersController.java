/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.UserDAO;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;

/**
 *
 * @author guilherme
 */
@Resource
public class UsersController {
    
    private UserDAO dao;
    private Result result;
    
    public UsersController(Result result, UserDAO dao){
        
        this.result = result;
        this.dao = dao;
        
    }
    
    public void index(){
        result.include("teste","FUNFOOO!!");
    }
    
    
}
