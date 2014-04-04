/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.PictureDAO;
import br.com.barterserver.dao.UserDAO;
import br.com.barterserver.login.UserSession;
import br.com.barterserver.model.Picture;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;
import java.util.List;

/**
 *
 * @author guilherme
 */
@Resource
public class PicturesController {
    
    private Result result;
    private PictureDAO dao;
    private UserSession userSession;
    private UserDAO userDAO;
    
    public PicturesController(Result result, PictureDAO dao, UserSession userSession, UserDAO userDAO){
        this.dao = dao;
        this.result = result;
        this.userSession = userSession;
        this.userDAO = userDAO;
    }
    
    public void save(Picture picture){
        dao.saveOrUpdate(picture);
    }
    
    @Post("user/picture/delete")
    public void deleteMyPicture(Picture picture, User user){
            List<Picture> listMyPics = user.getPictures();
            for(Picture p: listMyPics){
                if(p.getId() == picture.getId()){
                    listMyPics.remove(p);
                    break;
                }
            }
            user.setPictures(listMyPics);
            userDAO.saveOrUpdate(user);
            result.use(Results.http()).body("Picture DELETED");
    }
    
}
