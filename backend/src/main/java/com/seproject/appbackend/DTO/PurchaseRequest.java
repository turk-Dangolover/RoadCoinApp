package com.seproject.appbackend.DTO;

import lombok.Data;

@Data
public class PurchaseRequest {
    private String verificationId;
    private int itemNumber;
}
