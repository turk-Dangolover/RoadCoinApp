package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@Service
public class DbLeaderService {

    private static final Logger logger = LoggerFactory.getLogger(DbLeaderService.class);

    private final JdbcTemplate jdbcTemplate;

    public DbLeaderService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getLeaderboard() {
        try {
            String sql = "SELECT username, allCoins, title FROM Users ORDER BY allCoins DESC LIMIT 50";
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            logger.error("Error retrieving leaderboard: {}", e.getMessage());
            return null;
        }
    }

    public Map<String, Object> getUserRank(String verification_id) {
        try {
            String sql = "SELECT username, allCoins, rank, title FROM (SELECT username, allCoins, verification_id, title, RANK() OVER (ORDER BY allCoins DESC) as rank FROM Users) as ranked_users WHERE verification_id = ?";
            return jdbcTemplate.queryForMap(sql, verification_id);
        } catch (Exception e) {
            logger.error("Error retrieving user rank: {}", e.getMessage());
            return null;
        }
    }
}
