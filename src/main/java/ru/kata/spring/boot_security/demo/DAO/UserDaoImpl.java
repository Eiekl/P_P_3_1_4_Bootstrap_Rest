package ru.kata.spring.boot_security.demo.DAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Autowired
    private RolesDao rolesDao;
    @PersistenceContext
    private EntityManager entityManager;

    public UserDaoImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void saveUser(User user) {
        if (getUserByName(user.getName()) != null) {
            return;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        entityManager.persist(user);
    }

    @Override
    public void removeUser(int id) {
        entityManager.remove(getUserById(id));
    }

    @Override
    public List<User> getAllUsers() {
        return entityManager.createQuery("select u from User u", User.class).getResultList();
    }

    @Override
    public User getUserById(int id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void updateUser(User user) {
         entityManager.merge(user);
    }

    @Override
    public User getUserByName(String name) {
        return entityManager.createQuery("select u from User u JOIN FETCH u.roles where u.username = :name"
                , User.class).setParameter("name", name).getResultList().stream().findFirst().orElse(null);
    }

    @Override
    public List<Role> getRoles() {
        return rolesDao.findAll();
    }

    @Override
    public List<Role> listByName(List<String> name) {
        return entityManager.createQuery("select r FROM Role r WHERE r.role in (:id)", Role.class)
                .setParameter("id", name)
                .getResultList();
    }
}
