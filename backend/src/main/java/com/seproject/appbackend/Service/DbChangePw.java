package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DbChangePw {

    private static final Logger logger = LoggerFactory.getLogger(DbChangePw.class);

    private final JdbcTemplate jdbcTemplate;

    public DbChangePw(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean changeUserData(String verification_id, String hashedPassword, String hashedNewPassword) {
        logger.info(hashedPassword);
        logger.info(hashedNewPassword);
        try {
            String checkPasswordSql = "SELECT COUNT(*) FROM users WHERE verification_id = ? AND password = ?";
            @SuppressWarnings("deprecation")
            int count = jdbcTemplate.queryForObject(checkPasswordSql, new Object[]{verification_id, hashedPassword}, Integer.class);

            if (count == 1) {
                String updatePasswordSql = "UPDATE users SET password = ? WHERE verification_id = ?";
                jdbcTemplate.update(updatePasswordSql, hashedNewPassword, verification_id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            logger.error("Error changing user password: {}", e.getMessage());
            return false;
        }
    }
}
