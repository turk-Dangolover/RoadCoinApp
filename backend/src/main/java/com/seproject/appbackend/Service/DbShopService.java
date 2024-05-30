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

    public Map<String, Object> getShopItems(String verificationId) {
        try {
            // Fetch all shop items
            String shopSql = "SELECT * FROM Shop";
            List<Map<String, Object>> shopItems = jdbcTemplate.queryForList(shopSql);
    
            // Fetch all items owned by the user
            String ownedItemsSql = "SELECT si.itemNumber, s.itemName, s.category, si.isEquipped " +
                                   "FROM UserItems si JOIN Shop s ON si.itemNumber = s.itemNumber " +
                                   "WHERE si.verification_id = ?";
            List<Map<String, Object>> ownedItems = jdbcTemplate.queryForList(ownedItemsSql, verificationId);
    
            // Separate equipped items
            Map<String, Object> equippedItems = new HashMap<>();
            for (Map<String, Object> item : ownedItems) {
                boolean isEquipped = (boolean) item.get("isEquipped");
                String category = (String) item.get("category");
                
                if (isEquipped) {
                    equippedItems.put(category, item);
                }
            }
    
            // Prepare the result
            Map<String, Object> result = new HashMap<>();
            result.put("allShopItems", shopItems);
            result.put("ownedItems", ownedItems);
            result.put("equippedItems", equippedItems);
    
            return result;
        } catch (Exception e) {
            logger.error("Error retrieving shop items: {}", e.getMessage(), e);
            return null;
        }
    }
    
    

    public Map<String, Object> buyItem(String verificationId, int itemNumber) {
        try {
            // Fetch item details
            String getItemSql = "SELECT price, stockQuantity, itemName, category FROM Shop WHERE itemNumber = ?";
            Map<String, Object> item = jdbcTemplate.queryForMap(getItemSql, itemNumber);
            int price = (int) item.get("price");
            int stockQuantity = (int) item.get("stockQuantity");
            String itemName = (String) item.get("itemName");
            String category = (String) item.get("category");
    
            if (stockQuantity <= 0) {
                logger.error("Item is out of stock");
                return null;
            }
    
            // Fetch user details
            String getUserSql = "SELECT currCoins FROM Users WHERE verification_id = ?";
            Map<String, Object> user = jdbcTemplate.queryForMap(getUserSql, verificationId);
            int currCoins = (int) user.get("currCoins");
    
            if (currCoins < price) {
                logger.error("Insufficient coins");
                return null;
            }
    
            // Check if user already owns the item
            String checkOwnershipSql = "SELECT COUNT(*) FROM UserItems WHERE verification_id = ? AND itemNumber = ?";
            @SuppressWarnings("deprecation")
            int ownershipCount = jdbcTemplate.queryForObject(checkOwnershipSql, new Object[]{verificationId, itemNumber}, Integer.class);
    
            if (ownershipCount > 0) {
            //If user already owns the item, equip it and un-equip all other items in the same category
            String unequipSql = "UPDATE UserItems SET isequipped = false WHERE verification_id = ? AND itemNumber IN (SELECT itemNumber FROM Shop WHERE category = ?)";
            jdbcTemplate.update(unequipSql, verificationId, category);
            
            String updateUserSql = "UPDATE UserItems SET isequipped = true WHERE verification_id = ? AND itemNumber = ?";
            jdbcTemplate.update(updateUserSql, verificationId, itemNumber);
                return null;
            }
    
            // Update user's coin balance
            String updateUserSql = "UPDATE Users SET currCoins = currCoins - ? WHERE verification_id = ?";
            jdbcTemplate.update(updateUserSql, price, verificationId);
    
            // Decrease the item's stock quantity
            String updateStockSql = "UPDATE Shop SET stockQuantity = stockQuantity - 1 WHERE itemNumber = ?";
            jdbcTemplate.update(updateStockSql, itemNumber);
    
            // Add the item to UserItems table
            String insertOwnershipSql = "INSERT INTO UserItems (verification_id, itemNumber, isEquipped) VALUES (?, ?, FALSE)";
            jdbcTemplate.update(insertOwnershipSql, verificationId, itemNumber);
    
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("currCoins", currCoins - price);
            response.put("itemNumber", itemNumber);
            response.put("itemName", itemName);
            response.put("category", category);
    
            return response;
        } catch (Exception e) {
            logger.error("Error during purchase: {}", e.getMessage());
            return null;
        }
    }
    
    
}
