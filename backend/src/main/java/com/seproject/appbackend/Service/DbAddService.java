package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DbAddService {

    private static final Logger logger = LoggerFactory.getLogger(DbAddService.class);

    private final JdbcTemplate jdbcTemplate;

    public DbAddService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean updateStats(String verificationId, int coins, int distance, int steps) {
        try {
            String updateSql = "UPDATE Users SET currCoins = currCoins + ?, allCoins = allCoins + ?, allRout = allRout + ?, allSteps = allSteps + ? WHERE verification_id = ?";
            int rows = jdbcTemplate.update(updateSql, coins, coins, distance, steps, verificationId);
            return rows > 0;
        } catch (Exception e) {
            logger.error("Error updating stats: {}", e.getMessage());
            return false;
        }
    }
}

