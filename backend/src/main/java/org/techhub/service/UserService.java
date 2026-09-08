// ============================================================
// UserService.java
// Admin/User management only
// ============================================================

package org.techhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.techhub.model.User;
import org.techhub.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {

        return userRepository.findAllUsers();
    }

    public User getUserById(int userId) {

        return userRepository
                .findUserById(userId)
                .orElse(null);
    }

    public boolean deleteUser(int userId) {

        return userRepository.deleteUser(userId) > 0;
    }

    public boolean updateUserStatus(
            int userId,
            String status) {

        return userRepository.updateUserStatus(
                userId,
                status
        ) > 0;
    }

    public int countUsers() {

        return userRepository.countUsers();
    }
}