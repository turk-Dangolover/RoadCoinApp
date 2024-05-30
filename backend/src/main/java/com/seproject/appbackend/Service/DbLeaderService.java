package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
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
        String sql = "SELECT u.username, u.allCoins, u.verification_id " +
                     "FROM Users u " +
                     "ORDER BY u.allCoins DESC LIMIT 50";
        List<Map<String, Object>> users = jdbcTemplate.queryForList(sql);

        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (Map<String, Object> user : users) {
            String verificationId = (String) user.get("verification_id");
            String itemsSql = "SELECT si.itemNumber, s.itemName, s.category, si.isEquipped " +
                              "FROM UserItems si JOIN Shop s ON si.itemNumber = s.itemNumber " +
                              "WHERE si.verification_id = ?";
            List<Map<String, Object>> items = jdbcTemplate.queryForList(itemsSql, verificationId);

            Map<String, Object> equippedItems = new HashMap<>();
            for (Map<String, Object> item : items) {
                boolean isEquipped = (boolean) item.get("isEquipped");
                String category = (String) item.get("category");
                
                if (isEquipped) {
                    equippedItems.put(category, item);
                }
            }

            user.put("equippedItems", equippedItems);
            leaderboard.add(user);
        }

        return leaderboard;
    } catch (Exception e) {
        logger.error("Error retrieving leaderboard: {}", e.getMessage(), e);
        return new ArrayList<>();
    }
}


public Map<String, Object> getUserRank(String verification_id) {
    try {
        String sql = "SELECT username, allCoins, verification_id, rank " +
                     "FROM (SELECT username, allCoins, verification_id, " +
                     "RANK() OVER (ORDER BY allCoins DESC) as rank " +
                     "FROM Users) as ranked_users " +
                     "WHERE verification_id = ?";
        Map<String, Object> userRank = jdbcTemplate.queryForMap(sql, verification_id);

        if (userRank == null || userRank.isEmpty()) {
            logger.info("No rank found for user with verification_id: {}", verification_id);
            return new HashMap<>();
        }

        String itemsSql = "SELECT si.itemNumber, s.itemName, s.category, si.isEquipped " +
                          "FROM UserItems si JOIN Shop s ON si.itemNumber = s.itemNumber " +
                          "WHERE si.verification_id = ?";
        List<Map<String, Object>> items = jdbcTemplate.queryForList(itemsSql, verification_id);

        Map<String, Object> equippedItems = new HashMap<>();
        for (Map<String, Object> item : items) {
            boolean isEquipped = (boolean) item.get("isEquipped");
            String category = (String) item.get("category");
            
            if (isEquipped) {
                equippedItems.put(category, item);
            }
        }

        userRank.put("equippedItems", equippedItems);
        return userRank;
    } catch (EmptyResultDataAccessException e) {
        logger.info("No user found with verification_id: {}", verification_id);
        return new HashMap<>();
    } catch (Exception e) {
        logger.error("Error retrieving user rank: {}", e.getMessage(), e);
        return new HashMap<>();
    }
}

}
