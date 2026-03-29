-- database setup for E-commer sahs accessories

-- create database
CREATE DATABASE sahs_store;

-- products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(100) NOT NULL,
    description TEXT
)

-- users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
)

-- orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- cart table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
)

-- add products
INSERT INTO products (name, price, image, description) VALUES
('Sony Wireless Headphones', 49.99, 'headphones.png', 'Good wireless headphones with noise cancellation. Battery lasts 20 hours. Very comfortable to wear for long time. Compatible with all phones.'),
('Logitech Gaming Mouse', 29.99, 'mouse.png', 'Gaming mouse with 6 buttons and adjustable DPI up to 12000. Works on any surface. Has RGB lighting and is very smooth.'),
('Mechanical Keyboard TKL', 59.99, 'keyboard.png', 'Tenkeyless mechanical keyboard with blue switches. Very good for typing and gaming. Has backlight and metal body.'),
('USB-C Fast Charging Cable', 9.99, 'cable.png', 'Strong braided USB-C cable 2 meters long. Supports fast charging 65W. Compatible with most phones and laptops.'),
('Power Bank 10000mAh', 24.99, 'powerbank.png', 'Portable charger with 10000mAh capacity. Can charge your phone around 3 times. Has 2 USB ports and 1 USB-C port.'),
('Gaming Headset Pro', 39.99, 'gaming_headset.png', 'Gaming headset with built-in microphone. Good surround sound. Compatible with PC, PS4, PS5 and Xbox. Soft ear cushions.')