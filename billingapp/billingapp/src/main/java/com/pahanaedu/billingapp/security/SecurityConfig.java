package com.pahanaedu.billingapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String FRONTEND = "http://localhost:5173";

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Swagger UI and API docs - completely open
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()
                        // Auth endpoints - open for registration and login
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Validation test endpoints - open for testing
                        .requestMatchers("/api/validation-test/**").permitAll()
                        // Frontend test endpoints - open for testing
                        .requestMatchers("/api/frontend-test/**").permitAll()
                        // Public endpoints
                        .requestMatchers(HttpMethod.GET, "/api/v1/items/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/public/**").permitAll()
                        // Admin endpoints - require ADMIN role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Customer endpoints - require authentication  
                        .requestMatchers("/api/v1/customers/**").authenticated()
                        // User management endpoints - require authentication
                        .requestMatchers("/api/v1/users/**").authenticated()
                        // All other requests need authentication
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()) // Enable HTTP Basic for Swagger testing
                .formLogin(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("*")); // Allow all origins for frontend testing
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        cfg.setExposedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
