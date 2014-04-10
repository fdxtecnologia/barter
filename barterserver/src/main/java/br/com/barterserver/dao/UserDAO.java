/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.com.barterserver.dao;

import br.com.barterserver.login.Permission;
import br.com.barterserver.model.Picture;
import br.com.barterserver.model.Role;
import br.com.barterserver.model.User;
import br.com.caelum.vraptor.ioc.Component;
import java.util.List;
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
    
   public User saveOrUpdateAndReturn(User user){
         
        session.saveOrUpdate(user);
        session.flush();
        
        return user;
    }
    
    public User getUserByCredentials(String email, String password){
        
        Query q = session.createQuery("from User u where u.email = :email and u.password = :password ");
        q.setParameter("email", email);
        q.setParameter("password", password);
        
        return (User) q.uniqueResult();
    }
    
    public List<Picture> searchPictures(String title){
        
        Query q = session.createQuery("from Picture p where p.title = :title ");
        q.setParameter("title", title);
        
        List<Picture> pictures = q.list();
        return pictures;
    }
    
    public User getUserByEmail(String email){
        
        Query q = session.createQuery("from User where u.email = :email");
        q.setParameter("email", email);
        
        return (User) q.uniqueResult();
        
    }
    
}
