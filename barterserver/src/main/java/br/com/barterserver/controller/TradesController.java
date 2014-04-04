/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.TradeDAO;
import br.com.barterserver.login.UserSession;
import br.com.barterserver.model.Status;
import br.com.barterserver.model.Trade;
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
public class TradesController {
    
    private TradeDAO dao;
    private Result result;
    
    public TradesController(Result result, TradeDAO dao){
        
        this.dao = dao;
        this.result = result;   
    }
    
    @Post("trade/post/list")
    public void listTrades(User user){
            List<Trade> listOfTrades = dao.listMyTrades(user);
            result.use(Results.json()).withoutRoot().from(listOfTrades).serialize();
    }
    
    
    @Post("trade/post/new")
    public void keepTrade(Trade trade){
        trade.setStatus(Status.PEDING);
        Trade t = dao.saveOrUpdateAndReturn(trade);
        result.use(Results.json()).withoutRoot().from(t).serialize();
    }
    
    @Post("trade/post/update")
    public void updateTrade(Trade trade){
        trade.setStatus(Status.PROCESSING);
        Trade t = dao.saveOrUpdateAndReturn(trade);
        result.use(Results.json()).withoutRoot().from(t).serialize();
    }
    
    @Post("trade/post/complete")
    public void completeTrade(Trade trade){
        trade.setStatus(Status.COMPLETE);
        dao.saveOrUpdate(trade);
        Trade t = dao.saveOrUpdateAndReturn(trade);
        result.use(Results.json()).withoutRoot().from(t).serialize();
    }
    
}
