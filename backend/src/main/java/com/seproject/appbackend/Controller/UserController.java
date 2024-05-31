package com.seproject.appbackend.Controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.regex.Pattern;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.seproject.appbackend.DTO.Users;
import com.seproject.appbackend.DTO.Change;
import com.seproject.appbackend.DTO.Stats;
import java.sql.SQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import com.seproject.appbackend.Service.DbService;
import com.seproject.appbackend.Service.DbShopService;
import com.seproject.appbackend.Service.DbStatsService;
import com.seproject.appbackend.Service.DbAddService;
import com.seproject.appbackend.Service.DbChangeEmail;
import com.seproject.appbackend.Service.DbChangePw;
import com.seproject.appbackend.Service.DbCheckService;
import com.seproject.appbackend.Service.DbLeaderService;
import com.seproject.appbackend.Service.MailSender;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.seproject.appbackend.DTO.StatsUpdateDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin
@RestController
public class UserController {

    @Autowired
    private DbService dbService;

    @Autowired
    private DbCheckService dbCheckService;

    @Autowired
    private DbChangePw dbChangePW;

    @Autowired
    private DbChangeEmail dbChangeEmail;

    @Autowired
    private DbLeaderService dbLeaderService;

    @Autowired
    private DbShopService dbShopService;

    @Autowired
    private DbAddService dbAddService;

    @Autowired
    private DbStatsService dbStatsService;

    @Autowired
    private MailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final JdbcTemplate jdbcTemplate;

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/update/stats")
    public ResponseEntity<String> updateStats(@RequestBody StatsUpdateDTO statsUpdateDTO) {
        String verification_id = statsUpdateDTO.getVerification_id();
        int coins = statsUpdateDTO.getCoins();
        int distance = statsUpdateDTO.getDistance();
        int steps = statsUpdateDTO.getSteps();

        boolean isUpdated = dbAddService.updateStats(verification_id, coins, distance, steps);
        if (isUpdated) {
            return ResponseEntity.ok("Stats updated successfully");
        } else {
            return ResponseEntity.status(400).body("Failed to update stats");
        }
    }

    @PostMapping("/delete/user")
    public ResponseEntity<String> deleteUser(@RequestBody Map<String, String> request) {
        String verificationId = request.get("verification_id");
        try {
            // Delete foreign key constraints
            String deleteItemsSql = "DELETE FROM UserItems WHERE verification_id = ?";
            jdbcTemplate.update(deleteItemsSql, verificationId);
            // Delete user
            String sql = "DELETE FROM Users WHERE verification_id = ?";
            jdbcTemplate.update(sql, verificationId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting user: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to delete user");
        }
    }

    @GetMapping("/user/coins/{verificationId}")
    public ResponseEntity<Map<String, Integer>> getUserCoins(@PathVariable String verificationId) {
    logger.info("getUserCoins called with verificationId: {}", verificationId);
        try {
            String sql = "SELECT currCoins FROM Users WHERE verification_id = ?";
            @SuppressWarnings("deprecation")
            int currCoins = jdbcTemplate.queryForObject(sql, new Object[]{verificationId}, Integer.class);
            Map<String, Integer> response = new HashMap<>();
            response.put("currCoins", currCoins);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error retrieving user coins: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

@GetMapping("/shop/items")
public ResponseEntity<Map<String, Object>> getShopItems(@RequestParam String verificationId) {
    Map<String, Object> items = dbShopService.getShopItems(verificationId);
    if (items == null) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
    return ResponseEntity.ok(items);
}


    @CrossOrigin
    @PostMapping("/shop/buy")
    public ResponseEntity<Object> buyItem(@RequestBody Map<String, Object> payload) {
        String verificationId = (String) payload.get("verificationId");
        int itemNumber = (int) payload.get("itemNumber");

        Map<String, Object> result = dbShopService.buyItem(verificationId, itemNumber);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(400).body("Purchase failed");
        }
    }

    @CrossOrigin
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        List<Map<String, Object>> leaderboard = dbLeaderService.getLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }

    @CrossOrigin
    @GetMapping("/user/rank/{verification_id}")
    public ResponseEntity<Object> getUserRank(@PathVariable String verification_id) {
        Map<String, Object> userRank = dbLeaderService.getUserRank(verification_id);
        return ResponseEntity.ok(userRank);
    }

    @CrossOrigin
    @PostMapping("/change/email")
    public ResponseEntity<Object> changeEmail(@RequestBody Change change) {
        try {
            String hashedPassword = hashPassword(change.getPassword());
            boolean isEmailChanged = dbChangeEmail.changeUserEmail(change.getVerification_id(), hashedPassword, change.getNewEmail());
            if (isEmailChanged) {
                return ResponseEntity.ok().body(Collections.singletonMap("message", "E-mail changed successfully"));
            } else {
                return ResponseEntity.status(401).body(Collections.singletonMap("message", "Password is incorrect"));
            }
        } catch (NoSuchAlgorithmException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("message", "Error processing request"));
        }
    }
    
    @CrossOrigin
    @PostMapping("/change/userData")
    public ResponseEntity<Object> changeUserData(@RequestBody Change change) {
        try {
            String hashedPassword = hashPassword(change.getOldPassword());
            String hashedNewPassword = hashPassword(change.getNewPassword());
            boolean isPasswordChanged = dbChangePW.changeUserData(change.getVerification_id(), hashedPassword, hashedNewPassword);
            if (isPasswordChanged) {
                return ResponseEntity.ok().body(Map.of("message", "Password changed successfully"));
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Old password is incorrect"));
            }
        } catch (NoSuchAlgorithmException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error processing request"));
        }
    }
    

    @CrossOrigin
    @PostMapping("/get/userData")
    public ResponseEntity<Object> getUserData(@RequestBody Stats stats) {
        Map<String, Object> userStats = dbStatsService.getStats(stats.getVerification_id());
        if (userStats != null) {
            return ResponseEntity.ok(userStats);
        } else {
            return ResponseEntity.status(401).body("Failed to fetch user data");
        }
    }

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    private boolean isValidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        return pattern.matcher(email).matches();
    }

    private String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hashedPasswordBytes = md.digest(password.getBytes());
        StringBuilder sb = new StringBuilder();
        for (byte b : hashedPasswordBytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    @CrossOrigin
    @PostMapping("/look")
    public ResponseEntity<Object> login(@RequestBody Users users) {
        try {
            String hashedPassword = hashPassword(users.getPassword());
            String verification_id = dbCheckService.getVerificationId(users.getUsername(), hashedPassword);
            if (verification_id != null) {
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("verification_id", verification_id);
                return ResponseEntity.ok(responseData);
            } else {
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        } catch (NoSuchAlgorithmException e) {
            return ResponseEntity.status(500).body("Error processing request");
        }
    }
    
    @CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody Users users) throws IOException, SQLException {
        if (!isValidEmail(users.getEmail())) {
            return ResponseEntity.status(400).body("Invalid email format");
        }

        String verification_id = UUID.randomUUID().toString();
        Boolean verify = false;
        String currURL = "http://192.168.178.21:8080/";

        try {
            String hashedPassword = hashPassword(users.getPassword());
            boolean insertInfo = dbService.saveDataToDb(users.getEmail(), users.getUsername(), hashedPassword, verify, verification_id);
            mailSender.sendDataMail(users.getEmail(), users.getUsername(), currURL, verification_id);
            if (insertInfo) {
                return ResponseEntity.ok("Registration successful");
            } else {
                return ResponseEntity.status(401).body("Invalid Info, try again");
            }
        } catch (NoSuchAlgorithmException e) {
            return ResponseEntity.status(500).body("Error processing request");
        }
    }

    @GetMapping("/verify")
    public String verifyDB(@RequestParam("token") String verification_id) throws IOException, SQLException {

        try {
            String sql = "UPDATE users SET verify = true WHERE verification_id = ?";
            jdbcTemplate.update(sql, verification_id);

            return "<br>Vielen Dank für die Bestätigung Ihrer E-Mail.";
        } catch (Exception e) {
            logger.error("verify status was not updated in db!: {}", e.getMessage());
            return "verify wurde nicht geupdated";
        }

    }

}