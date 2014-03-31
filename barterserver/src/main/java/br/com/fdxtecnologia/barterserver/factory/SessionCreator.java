/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.fdxtecnologia.barterserver.factory;

import br.com.caelum.vraptor.ioc.Component;
import br.com.caelum.vraptor.ioc.ComponentFactory;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import org.hibernate.Session;

/**
 *
 * @author guilherme
 */
@Component
public class SessionCreator implements ComponentFactory<Session> {

    private Session session;

    @PostConstruct
    public void create() {
        this.session = HibernateFactory.getSession();
    }

    @Override
    public Session getInstance() {
        return session;
    }

    @PreDestroy
    public void destroy() {
        this.session.close();
    }
}
