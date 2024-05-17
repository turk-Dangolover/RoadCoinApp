package com.seproject.appbackend.Service;

import java.util.List;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.jdbc.core.JdbcTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DbService {

    private static final Logger logger = LoggerFactory.getLogger(DbService.class);

    private final JdbcTemplate jdbcTemplate;

    public DbService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    @CrossOrigin
    @PostMapping("/save")
    public void saveDataToDb(String email, String username, String password, Boolean verify, String verification_id) throws SQLException {
 
        try {
            String sql = "INSERT INTO users (username, email, password, verify, verification_id) " +
                    "VALUES (?, ?, ?, ?, ?)";

            jdbcTemplate.update(connection -> {
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, username);
                preparedStatement.setString(2, email);
                preparedStatement.setString(3, password);
                preparedStatement.setBoolean(4, verify);
                preparedStatement.setString(5, verification_id);
                return preparedStatement;
            });
            logger.info("Data was saved in the db!");

        } catch (Exception e) {
            logger.error("Failed to insert user info into db!: {}", e.getMessage());
        }

    }
}