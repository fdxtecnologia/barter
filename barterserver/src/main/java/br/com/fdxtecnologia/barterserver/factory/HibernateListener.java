/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.fdxtecnologia.barterserver.factory;

import java.util.Date;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 *
 * @author guilherme
 */
public class HibernateListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        HibernateFactory.createSessionFactory();
        sce.getServletContext().log("Session Factory Inicializada: " + new Date());
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        HibernateFactory.getSessionFactory().close();
        sce.getServletContext().log("Session Factory Destruida: " + new Date());
    }
}

