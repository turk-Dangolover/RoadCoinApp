package com.seproject.appbackend.DTO;

import lombok.Data;

@Data
public class Change {
    private String newEmail;
    private String username;
    private String password;
    private String oldPassword;
    private String newPassword;
    private String verification_id;
}