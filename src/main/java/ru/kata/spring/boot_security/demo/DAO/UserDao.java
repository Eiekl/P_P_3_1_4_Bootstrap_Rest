package ru.kata.spring.boot_security.demo.DAO;





import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserDao {
    void saveUser (User user);
    void removeUser (int id);
    List<User> getAllUsers();
    User getUserById (int id);
    void updateUser (int id, User user);
    User getUserByName (String name);
    List<Role> getRoles ();
}
