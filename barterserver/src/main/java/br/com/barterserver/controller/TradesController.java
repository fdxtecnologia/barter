/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.controller;

import br.com.barterserver.dao.TradeDAO;
import br.com.barterserver.model.Status;
import br.com.barterserver.model.Trade;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Resource;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.core.RequestInfo;
import br.com.caelum.vraptor.http.route.Router;
import br.com.caelum.vraptor.resource.HttpMethod;
import br.com.caelum.vraptor.view.Results;
import java.util.List;
import java.util.Set;

/**
 *
 * @author guilherme
 */
@Resource
public class TradesController {
    
    private TradeDAO dao;
    private Result result;
    private Router router;
    private RequestInfo requestInfo;
    
    public TradesController(Result result, TradeDAO dao, Router router, RequestInfo requestInfo){
        
        this.dao = dao;
        this.result = result;
        this.router = router;
        this.requestInfo = requestInfo;
        
    }
    
    @Path("trade/post/list")
    public void listTrades(User user){
        
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin");
        //----------------HTTP HEADER NEVER CHANGE----------------------//         
        
            List<Trade> listOfTrades = dao.listMyTrades(user);
            result.use(Results.json()).withoutRoot().from(listOfTrades).serialize();
    }
    
    
    @Path("trade/post/new")
    public void keepTrade(Trade trade){
        
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin");
        //----------------HTTP HEADER NEVER CHANGE----------------------//        
        
        trade.setStatus(Status.PEDING);
        Trade t = dao.saveOrUpdateAndReturn(trade);
        result.use(Results.json()).withoutRoot().from(t).serialize();
    }
    
    @Path("trade/post/update")
    public void updateTrade(Trade trade){
        
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin");
        //----------------HTTP HEADER NEVER CHANGE----------------------//        
        
        trade.setStatus(Status.PROCESSING);
        Trade t = dao.saveOrUpdateAndReturn(trade);
        result.use(Results.json()).withoutRoot().from(t).serialize();
    }
    
    @Path("trade/post/complete")
    public void completeTrade(Trade trade){
        
        //----------------HTTP HEADER NEVER CHANGE----------------------//
        Set<HttpMethod> allowed = router.allowedMethodsFor(requestInfo.getRequestedUri());
        result.use(Results.status()).header("Allow", allowed.toString().replaceAll("\\[|\\]", ""));  
        result.use(Results.status()).header("Access-Control-Allow-Origin", "*");           
        result.use(Results.status()).header("Access-Control-Allow-Methods", allowed.toString().replaceAll("\\[|\\]", ""));           
        result.use(Results.status()).header("Access-Control-Allow-Headers", "Content-Type, accept, authorization, origin");
        //----------------HTTP HEADER NEVER CHANGE----------------------//       
        
        trade.setStatus(Status.COMPLETE);
        dao.saveOrUpdate(trade);
        Trade t = dao.saveOrUpdateAndReturn(trade);
        result.use(Results.json()).withoutRoot().from(t).serialize();
    }
    
}
