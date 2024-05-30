package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DbCheckService {

    private static final Logger logger = LoggerFactory.getLogger(DbCheckService.class);

    private final JdbcTemplate jdbcTemplate;

    public DbCheckService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String getVerificationId(String username, String hashedPassword) {
        try {
            String sql = "SELECT verification_id FROM Users WHERE username = ? AND password = ?";
            @SuppressWarnings("deprecation")
            String verification_id = jdbcTemplate.queryForObject(sql, new Object[]{username, hashedPassword}, String.class);
            return verification_id;
        } catch (Exception e) {
            logger.error("Error during user authentication: {}", e.getMessage());
            return null;
        }
    }
}
