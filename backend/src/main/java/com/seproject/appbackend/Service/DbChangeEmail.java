package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DbChangeEmail {

    private static final Logger logger = LoggerFactory.getLogger(DbChangeEmail.class);

    private final JdbcTemplate jdbcTemplate;

    public DbChangeEmail(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean changeUserEmail(String verification_id, String hashedPassword, String newEmail) {
        try {
            String checkPasswordSql = "SELECT COUNT(*) FROM users WHERE verification_id = ? AND password = ?";
            @SuppressWarnings("deprecation")
            int count = jdbcTemplate.queryForObject(checkPasswordSql, new Object[]{verification_id, hashedPassword}, Integer.class);

            if (count == 1) {
                String updateEmailSql = "UPDATE users SET email = ? WHERE verification_id = ?";
                jdbcTemplate.update(updateEmailSql, newEmail, verification_id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            logger.error("Error changing user email: {}", e.getMessage());
            return false;
        }
    }
}