package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/admin")
public class AdminRestController {
    private final UserService userService;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(userService.getUserByUsername(principal.getName()));
    }

    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/oneUser/{id}")
    public ResponseEntity<User> getOneUser(@PathVariable("id") int id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/new")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if(user.getRoles()!=null) {
            List<String> usersRolesList = user.getRoles().stream().map(r->r.getRole()).collect(Collectors.toList());
            List<Role> listOfNamesRoles = userService.listByRole(usersRolesList);
            user.setRoles(listOfNamesRoles);
        }
        userService.saveUser(user);
        return ResponseEntity.ok(user);


    }
    @PatchMapping("/update")
    public ResponseEntity<?> updateUser (@RequestBody User user){
        if(user.getRoles()!=null) {
            List<String> usersRolesList = user.getRoles().stream().map(r->r.getRole()).collect(Collectors.toList());
            List<Role> listOfNamesRoles = userService.listByRole(usersRolesList);
            user.setRoles(listOfNamesRoles);
        }

        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable ("id") int id) {
    userService.removeUser(id);
    return ResponseEntity.ok(HttpStatus.OK);
    }
@GetMapping("/rollist")
    public ResponseEntity<List <Role>> getRoles () {
        return ResponseEntity.ok(userService.getRoles());
    }
}
