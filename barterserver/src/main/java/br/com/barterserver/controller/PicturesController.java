/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.PictureDAO;
import br.com.barterserver.model.Picture;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;

/**
 *
 * @author guilherme
 */
@Resource
public class PicturesController {
    
    private Result result;
    private PictureDAO dao;
    
    public PicturesController(Result result, PictureDAO dao){
        this.dao = dao;
        this.result = result;
    }
    
    public void save(Picture picture){
        dao.saveOrUpdate(picture);
    }
    
}
