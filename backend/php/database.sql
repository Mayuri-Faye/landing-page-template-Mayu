<?php
/**
 * SQL Script to setup database for phpMyAdmin
 * Copy and paste this in phpMyAdmin SQL tab
 */

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS landing_page;
USE landing_page;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created (created_at)
);
