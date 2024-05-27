package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DbShopService {

    private static final Logger logger = LoggerFactory.getLogger(DbShopService.class);

    private final JdbcTemplate jdbcTemplate;

    public DbShopService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getShopItems() {
        try {
            String sql = "SELECT * FROM Shop";
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            logger.error("Error retrieving shop items: {}", e.getMessage());
            return null;
        }
    }

    public List<Map<String, Object>> getAvatarItems(String verificationId) {
        try {
            String sql = "SELECT Shop.itemNumber, Shop.itemName, Shop.description, Shop.category " +
                         "FROM AvatarItems " +
                         "JOIN Shop ON AvatarItems.itemNumber = Shop.itemNumber " +
                         "WHERE AvatarItems.userId = ?";
            return jdbcTemplate.queryForList(sql, verificationId);
        } catch (Exception e) {
            logger.error("Error retrieving avatar items: {}", e.getMessage());
            return null;
        }
    }

    public Map<String, Object> buyItem(String verificationId, int itemNumber) {
        try {
            logger.info("Starting purchase process for verificationId: {}, itemNumber: {}", verificationId, itemNumber);
    
            String getItemSql = "SELECT price, stockQuantity FROM Shop WHERE itemNumber = ?";
            Map<String, Object> item = jdbcTemplate.queryForMap(getItemSql, itemNumber);
            logger.info("Item details: {}", item);
    
            int price = (int) item.get("price");
            int stockQuantity = (int) item.get("stockQuantity");
    
            if (stockQuantity <= 0) {
                logger.error("Item is out of stock");
                return null;
            }
    
            String getUserSql = "SELECT currCoins FROM Users WHERE verification_id = ?";
            logger.info("Executing SQL: {}", getUserSql);
    
            @SuppressWarnings("deprecation")
            Integer currCoins = jdbcTemplate.queryForObject(getUserSql, new Object[]{verificationId}, Integer.class);
            logger.info("Current coins for user {}: {}", verificationId, currCoins);
    
            if (currCoins == null) {
                logger.error("No user found with verification_id: {}", verificationId);
                return null;
            }
    
            if (currCoins < price) {
                logger.error("Insufficient coins for user with verification_id: {}", verificationId);
                return null;
            }
    
            String updateUserSql = "UPDATE Users SET currCoins = currCoins - ? WHERE verification_id = ?";
            jdbcTemplate.update(updateUserSql, price, verificationId);
            logger.info("Updated user coins for user {}: -{}", verificationId, price);
    
            String updateStockSql = "UPDATE Shop SET stockQuantity = stockQuantity - 1 WHERE itemNumber = ?";
            jdbcTemplate.update(updateStockSql, itemNumber);
            logger.info("Updated stock quantity for itemNumber: {}", itemNumber);
    
            // Add the purchased item to AvatarItems for the user
            String addItemToAvatarSql = "INSERT INTO AvatarItems (userId, itemNumber) VALUES (?, ?)";
            logger.info("Executing SQL: {} with userId: {} and itemNumber: {}", addItemToAvatarSql, verificationId, itemNumber);
            jdbcTemplate.update(addItemToAvatarSql, verificationId, itemNumber);
            logger.info("Added item {} to AvatarItems for user {}", itemNumber, verificationId);
    
            Map<String, Object> response = new HashMap<>();
            response.put("currCoins", currCoins - price);
            response.put("itemNumber", itemNumber);
            return response;
        } catch (Exception e) {
            logger.error("Error during purchase: {}", e.getMessage());
            return null;
        }
    }
    

    public Map<String, Object> getUserCoins(String verificationId) {
        try {
            String sql = "SELECT currCoins FROM Users WHERE verification_id = ?";
            logger.info("Executing SQL: {}", sql);

            @SuppressWarnings("deprecation")
            Integer currCoins = jdbcTemplate.queryForObject(sql, new Object[]{verificationId}, Integer.class);
            logger.info("Current coins for user {}: {}", verificationId, currCoins);

            Map<String, Object> response = new HashMap<>();
            response.put("currCoins", currCoins);
            return response;
        } catch (Exception e) {
            logger.error("Error retrieving user coins: {}", e.getMessage());
            return null;
        }
    }
}
