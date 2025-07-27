-- Update existing admin user with correct password hash
-- Run this if you already have the database created

USE tasksea;

-- First, add the role column if it doesn't exist
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' NOT NULL;

-- Update existing admin user or insert new one
INSERT INTO users (name, email, password, role) VALUES 
('Administrator', 'admin@tasksea.com', '$2a$10$zwCZW./ngwk6bSaU3AkPu.BfQMCS4uIKv9aY3ps3xFhZ3K8NzTgsO', 'admin')
ON DUPLICATE KEY UPDATE 
password = '$2a$10$zwCZW./ngwk6bSaU3AkPu.BfQMCS4uIKv9aY3ps3xFhZ3K8NzTgsO',
role = 'admin';

-- Verify the admin user exists
SELECT id, name, email, role FROM users WHERE email = 'admin@tasksea.com';
