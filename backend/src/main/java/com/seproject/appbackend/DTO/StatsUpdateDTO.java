package com.seproject.appbackend.DTO;

import lombok.Data;

@Data
public class StatsUpdateDTO {
    private String verification_id;
    private int coins;
    private int distance;
    private int steps;
}
