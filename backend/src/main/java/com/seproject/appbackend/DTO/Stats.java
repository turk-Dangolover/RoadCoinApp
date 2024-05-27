package com.seproject.appbackend.DTO;

import lombok.Data;

@Data
public class Stats {
    private String verification_id;
    private int allcoins;
    private int allrout;
    private int allsteps;
    private String username;
}
