package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Service
public class DbStatsService {

    private static final Logger logger = LoggerFactory.getLogger(DbStatsService.class);

    private final JdbcTemplate jdbcTemplate;

    public DbStatsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getStats(String verification_id) {
        try {
            String sql = "SELECT username, allcoins, allrout, allsteps FROM users WHERE verification_id = ?";
            logger.info("Executing SQL query: " + sql + " with verification_id: " + verification_id);
            return jdbcTemplate.queryForMap(sql, verification_id);
        } catch (Exception e) {
            logger.error("Error retrieving user stats: {}", e.getMessage());
            return null;
        }
    }
}
