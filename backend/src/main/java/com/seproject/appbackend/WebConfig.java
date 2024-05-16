package com.seproject.appbackend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*") // Erlaube Anfragen von allen Quellen
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Erlaube bestimmte HTTP-Methoden
                .allowedHeaders("*"); // Erlaube alle Header
    }
}
