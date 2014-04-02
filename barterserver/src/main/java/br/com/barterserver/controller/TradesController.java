/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.TradeDAO;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;

/**
 *
 * @author guilherme
 */
@Resource
public class TradesController {
    
    private TradeDAO dao;
    private Result result;
    
    public TradesController(Result result, TradeDAO dao){
        
        this.dao = dao;
        this.result = result;    
    }
    
}
