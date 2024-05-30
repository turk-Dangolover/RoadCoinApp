package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DbStatsService {

    private static final Logger logger = LoggerFactory.getLogger(DbStatsService.class);

    private final JdbcTemplate jdbcTemplate;

    public DbStatsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

public Map<String, Object> getStats(String verificationId) {
    try {
        // Fetch user basic stats
        String userSql = "SELECT username, allcoins, allrout, allsteps FROM users WHERE verification_id = ?";
        logger.info("Executing SQL query: {} with verification_id: {}", userSql, verificationId);
        Map<String, Object> userStats = jdbcTemplate.queryForMap(userSql, verificationId);

        // Fetch all owned items
        String itemsSql = "SELECT si.itemNumber, s.itemName, s.category, si.isEquipped " +
                          "FROM UserItems si JOIN Shop s ON si.itemNumber = s.itemNumber " +
                          "WHERE si.verification_id = ?";
        logger.info("Executing SQL query: {} with verification_id: {}", itemsSql, verificationId);
        List<Map<String, Object>> items = jdbcTemplate.queryForList(itemsSql, verificationId);

        // Separate equipped items
        Map<String, Object> equippedItems = new HashMap<>();
        List<Map<String, Object>> ownedItems = new ArrayList<>();
        
        for (Map<String, Object> item : items) {
            boolean isEquipped = (boolean) item.get("isEquipped");
            String category = (String) item.get("category");
            
            if (isEquipped) {
                equippedItems.put(category, item);
            }
            ownedItems.add(item);
        }

        // Add items and equipped items to userStats
        userStats.put("items", ownedItems);
        userStats.put("equippedItems", equippedItems);

        return userStats;
    } catch (EmptyResultDataAccessException e) {
        logger.error("No user found with verification_id: {}", verificationId);
        return null;
    } catch (DataAccessException e) {
        logger.error("Error retrieving user stats for verification_id: {}: {}", verificationId, e.getMessage());
        return null;
    }
}

}
