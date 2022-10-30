package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;


@Controller
public class UsersController {
    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/user")
    public String welcome(Model model, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }

    @GetMapping(value = "/admin")
    public String printUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
    }

    @GetMapping(value = "/admin/new")
    public String newUser(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("roles_list", userService.getRoles());
        return "new";
    }

    @PostMapping(value = "/admin")
    public String createUser(@ModelAttribute("user") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/admin/{id}/edit")
    public String editUser (@PathVariable("id") int id, Model model){
        model.addAttribute("user", userService.getUserById(id));
        model.addAttribute("roles_list", userService.getRoles());
        return "edit";
    }

    @PostMapping("admin/edit/{id}")
    public String updateUser (@PathVariable("id") int id, @ModelAttribute("user") User user) {
        userService.updateUser(id,user);
        return "redirect:/admin";
    }

    @GetMapping("admin/{id}/delete")
    public String delete (@PathVariable("id") int id) {
        userService.removeUser(id);
        return "redirect:/admin";
    }
}
