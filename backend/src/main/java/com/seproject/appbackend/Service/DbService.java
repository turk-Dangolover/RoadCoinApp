package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
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

    public boolean saveDataToDb(String email, String username, String password, Boolean verify, String verification_id) {
        try {
            String sql = "INSERT INTO Users (email, username, password, verify, verification_id) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, email, username, password, verify, verification_id);
            return true;
        } catch (Exception e) {
            logger.error("Error saving data to database: {}", e.getMessage());
            return false;
        }
    }
}
