package com.seproject.appbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.SpringServletContainerInitializer;

@SpringBootApplication
public class AppbackendApplication extends SpringServletContainerInitializer{

	public static void main(String[] args) {
		SpringApplication.run(AppbackendApplication.class, args);
	}

}