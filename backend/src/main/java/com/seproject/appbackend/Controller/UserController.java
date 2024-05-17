package com.seproject.appbackend.Controller;

import java.util.UUID;
import java.util.regex.Pattern;

import com.seproject.appbackend.DTO.Users;
import java.sql.SQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

// import java.io.File;
import java.io.IOException;
// import java.io.FileInputStream;
// import java.io.FileOutputStream;

import com.lowagie.text.DocumentException;
import com.seproject.appbackend.Service.DbService;
// import com.seproject.appbackend.Service.MailSender;

import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.regex.Matcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin
@RestController
public class UserController {

    @Autowired
    private DbService dbService;

    // @Autowired
    // private MailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z]{2,}$";
        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    private final JdbcTemplate jdbcTemplate;

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/save")
    public void save(@RequestBody Users users) throws IOException, SQLException, DocumentException {

        if (!isValidEmail(users.getEmail())) {
            System.out.println(
                    "Es tut uns leid, aber die E-Mail-Adresse, die Sie eingegeben haben, ist ungültig. Bitte geben Sie eine gültige E-Mail-Adresse ein und versuchen Sie es erneut. Vielen Dank!");
            return;
        }

        String verification_id = UUID.randomUUID().toString();
        Boolean verify = false;


        dbService.saveDataToDb(users.getEmail(), users.getUsername(), users.getPassword(), verify, verification_id);

        // mailSender.sendDataMail(users.getEmail(), users.getFirstName(), users.getLastName(), users.getCurrURL(),
        //         verification_id);
    }

    // @GetMapping("/verify")
    // public String verifyDB(@RequestParam("token") String verification_id) throws IOException, SQLException {

    //     try {
    //         String sql = "UPDATE tb_brr_users SET verify = true WHERE verification_id = ?";
    //         jdbcTemplate.update(sql, verification_id);

    //         return "<br>Vielen Dank für die Bestätigung Ihrer E-Mail.";
    //     } catch (Exception e) {
    //         logger.error("verify status was not updated in db!: {}", e.getMessage());
    //         return "verify wurde nicht geupdated";
    //     }

    // }

}