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

    public Map<String, Object> buyItem(String verificationId, int itemNumber) {
        try {
            String getItemSql = "SELECT price, stockQuantity, itemName FROM Shop WHERE itemNumber = ?";
            Map<String, Object> item = jdbcTemplate.queryForMap(getItemSql, itemNumber);
            int price = (int) item.get("price");
            int stockQuantity = (int) item.get("stockQuantity");
            String itemName = (String) item.get("itemName");
    
            if (stockQuantity <= 0) {
                logger.error("Item is out of stock");
                return null;
            }
    
            String getUserSql = "SELECT currCoins, title FROM Users WHERE verification_id = ?";
            Map<String, Object> user = jdbcTemplate.queryForMap(getUserSql, verificationId);
            int currCoins = (int) user.get("currCoins");
            String userTitle = (String) user.get("title");
    
            if (userTitle != null && userTitle.equals(itemName)) {
                logger.error("You already have this item: " + itemName);
                return null;
            }
    
            if (currCoins < price) {
                logger.error("Insufficient coins");
                return null;
            }
    
            String updateUserSql = "UPDATE Users SET currCoins = currCoins - ?, title = ? WHERE verification_id = ?";
            jdbcTemplate.update(updateUserSql, price, itemName, verificationId);
    
            String updateStockSql = "UPDATE Shop SET stockQuantity = stockQuantity - 1 WHERE itemNumber = ?";
            jdbcTemplate.update(updateStockSql, itemNumber);
    
            Map<String, Object> response = new HashMap<>();
            response.put("currCoins", currCoins - price);
            response.put("itemNumber", itemNumber);
            return response;
        } catch (Exception e) {
            logger.error("Error during purchase: {}", e.getMessage());
            return null;
        }
    }
    
}
