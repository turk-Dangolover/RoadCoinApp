package com.seproject.appbackend.Controller;

import java.util.HashMap;
import java.util.regex.Pattern;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.seproject.appbackend.DTO.Users;
import com.seproject.appbackend.DTO.Change;
import com.seproject.appbackend.DTO.PurchaseRequest;
import com.seproject.appbackend.DTO.Stats;
import java.sql.SQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

// import java.io.File;
import java.io.IOException;
// import java.io.FileInputStream;
// import java.io.FileOutputStream;

import com.lowagie.text.DocumentException;
import com.seproject.appbackend.Service.DbService;
import com.seproject.appbackend.Service.DbShopService;
import com.seproject.appbackend.Service.DbStatsService;
import com.seproject.appbackend.Service.DbChangeEmail;
import com.seproject.appbackend.Service.DbChangePw;
import com.seproject.appbackend.Service.DbCheckService;
import com.seproject.appbackend.Service.DbLeaderService;
import com.seproject.appbackend.Service.MailSender;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

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
    private DbStatsService dbStatsService;

    @Autowired
    private MailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final JdbcTemplate jdbcTemplate;

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/delete/user")
    public ResponseEntity<String> deleteUser(@RequestBody Map<String, String> request) {
        String verificationId = request.get("verification_id");
        try {
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
    public ResponseEntity<List<Map<String, Object>>> getShopItems() {
        List<Map<String, Object>> items = dbShopService.getShopItems();
        return ResponseEntity.ok(items);
    }

    @CrossOrigin
    @PostMapping("/shop/buy")
    public ResponseEntity<Map<String, Object>> buyItem(@RequestBody Map<String, Object> request) {
        String verificationId = (String) request.get("verificationId");
        int itemNumber = (int) request.get("itemNumber");
        Map<String, Object> result = dbShopService.buyItem(verificationId, itemNumber);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(400).body(null);
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
        boolean isEmailChanged = dbChangeEmail.changeUserEmail(change.getVerification_id(), change.getPassword(), change.getNewEmail());
        if (isEmailChanged) {
            return ResponseEntity.ok().body("E-mail changed successfully");
        } else {
            return ResponseEntity.status(401).body("Password is incorrect");
        }
    }


    @CrossOrigin
    @PostMapping("/change/userData")
    public ResponseEntity<Object> changeUserData(@RequestBody Change change) {
        boolean isPasswordChanged = dbChangePW.changeUserData(change.getVerification_id(), change.getOldPassword(), change.getNewPassword());
        if (isPasswordChanged) {
            return ResponseEntity.ok().body("Password changed successfully");
        } else {
            return ResponseEntity.status(401).body("Old password is incorrect");
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
   

    @CrossOrigin
    @PostMapping("/look")
    public ResponseEntity<Object> look(@RequestBody Users users) {
        String verification_id = dbCheckService.getVerificationId(users.getUsername(), users.getPassword());
        if (verification_id != null) {
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("verification_id", verification_id);
            return ResponseEntity.ok(responseData);
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    private boolean isValidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        return pattern.matcher(email).matches();
    }
    
    @CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody Users users) throws IOException, SQLException, DocumentException {

        if (!isValidEmail(users.getEmail())) {
            return ResponseEntity.status(400).body("Invalid email format");
        }

        String verification_id = UUID.randomUUID().toString();
        Boolean verify = false;
        String currURL = "http://192.168.178.21:8080/";

        boolean insertInfo = dbService.saveDataToDb(users.getEmail(), users.getUsername(), users.getPassword(), verify, verification_id);
        if (insertInfo) {
            mailSender.sendDataMail(users.getEmail(), users.getUsername(), currURL, verification_id);
            return ResponseEntity.ok("Registration successful");
        } else {
            return ResponseEntity.status(401).body("Invalid Info, try again");
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