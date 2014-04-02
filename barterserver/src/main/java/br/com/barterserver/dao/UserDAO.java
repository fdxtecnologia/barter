/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.dao;

import br.com.barterserver.login.Permission;
import br.com.barterserver.model.Role;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.ioc.Component;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author guilherme
 */
@Component
public class UserDAO extends GenericDAO<User>{

    public UserDAO(Session session) {
        super(session);
    }
    
    public User getUserByCredentials(String email, String password){
        
        Query q = session.createQuery("from User u where u.email = :email and u.password = :password ");
        q.setParameter("email", email);
        q.setParameter("password", password);
        
        return (User) q.uniqueResult();
    }
    
}
