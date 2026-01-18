-- Database Schema for KiddoZ Childcare System
-- Generated for MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS kiddoz_db;
USE kiddoz_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'parent', 'teacher', 'nurse', 'nanny') DEFAULT 'parent', -- Only 'admin' and 'teacher' have admin portal access
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS Students (
    id VARCHAR(20) PRIMARY KEY, -- String ID like S-1001
    parent_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    dob DATE,
    enrollment_status ENUM('Active', 'Graduated', 'Withdrawn') DEFAULT 'Active',
    plan VARCHAR(50), -- Growth Scholar, etc.
    photo_url VARCHAR(255),
    -- Daily Stats (Denormalized for simple view)
    attendance_status VARCHAR(20) DEFAULT 'Absent',
    temp VARCHAR(10),
    mood VARCHAR(50),
    meal_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. Staff Table
CREATE TABLE IF NOT EXISTS Staff (
    id VARCHAR(20) PRIMARY KEY, -- S-001
    user_id INT, -- Optional link to User account if they have login
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Nanny, Teacher
    experience VARCHAR(50),
    specialty VARCHAR(100),
    rate DECIMAL(10, 2),
    availability VARCHAR(50),
    area VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 5.00,
    img_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Attendance Integ
CREATE TABLE IF NOT EXISTS Attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') DEFAULT 'Present',
    check_in_time TIME,
    check_out_time TIME,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
);

-- ==========================================
-- SEED DATA (Bangladeshi Names)
-- ==========================================

-- Users (Parents & Admins)
INSERT INTO Users (email, password_hash, full_name, phone, role, address) VALUES
('admin@kiddoz.com', '$2a$10$YourHashedPasswordHere', 'Admin Iftikhar', '01711000000', 'admin', 'Dhaka, Bangladesh'),
('rahim@gmail.com', '$2a$10$YourHashedPasswordHere', 'Rahim Uddin', '01812345678', 'parent', 'Gulshan, Dhaka'),
('fatima@gmail.com', '$2a$10$YourHashedPasswordHere', 'Fatima Begum', '01987654321', 'parent', 'Banani, Dhaka'),
('karim@gmail.com', '$2a$10$YourHashedPasswordHere', 'Karim Sheikh', '01711112222', 'parent', 'Uttara, Dhaka'),
('nasrin@gmail.com', '$2a$10$YourHashedPasswordHere', 'Nasrin Akter', '01600000000', 'parent', 'Dhanmondi, Dhaka'),
('jamal@gmail.com', '$2a$10$YourHashedPasswordHere', 'Jamal Hossain', '01555555555', 'parent', 'Mirpur, Dhaka'),
('tahmina@gmail.com', '$2a$10$YourHashedPasswordHere', 'Tahmina Khan', '01888888888', 'parent', 'Bashundhara, Dhaka'),
('rafiq@gmail.com', '$2a$10$YourHashedPasswordHere', 'Rafiqul Islam', '01999999999', 'parent', 'Mohammadpur, Dhaka'),
('shirin@gmail.com', '$2a$10$YourHashedPasswordHere', 'Shirin Jahan', '01333333333', 'parent', 'Badda, Dhaka'),
('monir@gmail.com', '$2a$10$YourHashedPasswordHere', 'Moniruzzaman', '01444444444', 'parent', 'Tejgaon, Dhaka');

-- Students (Children)
INSERT INTO Students (id, parent_id, name, age, gender, plan, attendance_status, temp, mood, meal_status) VALUES
('S-1001', 2, 'Ayan Uddin', 4, 'Male', 'Growth Scholar', 'Present', '98.6', 'Happy', 'Finished'),
('S-1002', 3, 'Sara Begum', 3, 'Female', 'Little Explorer', 'Present', '98.5', 'Calm', 'Half Eaten'),
('S-1003', 4, 'Ishraq Sheikh', 5, 'Male', 'VIP Guardian', 'Present', '99.0', 'Energetic', 'Finished'),
('S-1004', 5, 'Nabila Akter', 2, 'Female', 'Growth Scholar', 'Absent', '-', '-', '-'),
('S-1005', 6, 'Zayn Hossain', 4, 'Male', 'Little Explorer', 'Present', '98.4', 'Happy', 'Finished'),
('S-1006', 7, 'Rehan Khan', 3, 'Male', 'Growth Scholar', 'Present', '98.7', 'Playful', 'Finished'),
('S-1007', 8, 'Samia Islam', 5, 'Female', 'VIP Guardian', 'Late', '98.6', 'Tired', 'Did not eat'),
('S-1008', 9, 'Fahad Jahan', 4, 'Male', 'Growth Scholar', 'Present', '98.5', 'Happy', 'Finished'),
('S-1009', 10, 'Zara Monir', 3, 'Female', 'Little Explorer', 'Present', '98.3', 'Calm', 'Half Eaten'),
('S-1010', 2, 'Arif Uddin', 2, 'Male', 'Growth Scholar', 'Present', '98.6', 'Crying', 'Finished');

-- Staff
INSERT INTO Staff (id, name, role, experience, specialty, rate, area, img_url) VALUES
('ST-001', 'Salma Khatun', 'Nanny', '5 Years', 'Infant Care', 300.00, 'Gulshan', 'https://randomuser.me/api/portraits/women/1.jpg'),
('ST-002', 'Rokeya Sultana', 'Teacher', '8 Years', 'Early Childhood', 500.00, 'Bashundhara', 'https://randomuser.me/api/portraits/women/2.jpg'),
('ST-003', 'Abul Kalam', 'Driver', '10 Years', 'Safe Driving', 200.00, 'Uttara', 'https://randomuser.me/api/portraits/men/1.jpg'),
('ST-004', 'Moushumi Akter', 'Nanny', '3 Years', 'Toddlers', 250.00, 'Dhanmondi', 'https://randomuser.me/api/portraits/women/3.jpg'),
('ST-005', 'Farhana Rahman', 'Nurse', '6 Years', 'First Aid', 600.00, 'Banani', 'https://randomuser.me/api/portraits/women/4.jpg'),
('ST-006', 'Jahor Ali', 'Security', '4 Years', 'Gatekeeping', 150.00, 'Mirpur', 'https://randomuser.me/api/portraits/men/2.jpg'),
('ST-007', 'Sumaiya Islam', 'Teacher', '5 Years', 'Art & Craft', 450.00, 'Mohammadpur', 'https://randomuser.me/api/portraits/women/5.jpg'),
('ST-008', 'Bilkis Begum', 'Cook', '12 Years', 'Healthy Meals', 200.00, 'Badda', 'https://randomuser.me/api/portraits/women/6.jpg'),
('ST-009', 'Kamal Hasan', 'Nanny', '4 Years', 'Active Play', 280.00, 'Tejgaon', 'https://randomuser.me/api/portraits/men/3.jpg'),
('ST-010','Sharmin Jahan','Teacher','550','7 Years','English Basics','Gulshan','Available','https://randomuser.me/api/portraits/women/7.jpg',5,'2026-01-17 14:13:29.231 +00:00','2026-01-17 14:13:29.231 +00:00');

-- 4. Payrolls Table
CREATE TABLE IF NOT EXISTS Payrolls (
  id CHAR(36) PRIMARY KEY,
  recipientName VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  amount FLOAT NOT NULL,
  status VARCHAR(255) DEFAULT 'Pending',
  type VARCHAR(255) DEFAULT 'Salary',
  date DATE DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- 5. Tasks Table
CREATE TABLE IF NOT EXISTS Tasks (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  assignedTo VARCHAR(255) DEFAULT 'All',
  completed TINYINT(1) DEFAULT 0,
  createdBy VARCHAR(255),
  completedBy VARCHAR(255),
  completedAt DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS Notifications (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(255) DEFAULT 'info',
  read TINYINT(1) DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- 7. CareTasks Table
CREATE TABLE IF NOT EXISTS CareTasks (
  id CHAR(36) PRIMARY KEY,
  scheduledTime VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  priority VARCHAR(255) DEFAULT 'Medium',
  studentId CHAR(36) NOT NULL,
  studentName VARCHAR(255) NOT NULL,
  `group` VARCHAR(255),
  status ENUM('Pending', 'Completed', 'Skipped') DEFAULT 'Pending',
  completedBy VARCHAR(255),
  completedAt DATETIME,
  details TEXT,
  date DATE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- 8. HealthRecords Table
CREATE TABLE IF NOT EXISTS HealthRecords (
  id CHAR(36) PRIMARY KEY,
  studentId VARCHAR(20) NOT NULL,
  recordType VARCHAR(100) NOT NULL, -- Vaccination, Checkup, Allergy, etc.
  fileName VARCHAR(255) NOT NULL,
  fileUrl VARCHAR(500),
  description TEXT,
  uploadedBy VARCHAR(255),
  uploadedAt DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE CASCADE
);

-- 9. DailyActivities Table
CREATE TABLE IF NOT EXISTS DailyActivities (
  id CHAR(36) PRIMARY KEY,
  studentId VARCHAR(20) NOT NULL,
  activityType VARCHAR(50) NOT NULL, -- meal, nap, mood, temperature, diaper
  value VARCHAR(255) NOT NULL, -- e.g., "Finished", "98.6°F", "Happy"
  details TEXT,
  timestamp DATETIME NOT NULL,
  recordedBy VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE CASCADE
);

-- 10. Billing Table
CREATE TABLE IF NOT EXISTS Billing (
  id CHAR(36) PRIMARY KEY,
  parentId INT NOT NULL,
  studentId VARCHAR(20),
  amount DECIMAL(10, 2) NOT NULL,
  dueDate DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid, Overdue
  description TEXT,
  plan VARCHAR(100),
  invoiceNumber VARCHAR(50),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (parentId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE SET NULL
);

-- 11. NannyBookings Table
CREATE TABLE IF NOT EXISTS NannyBookings (
  id CHAR(36) PRIMARY KEY,
  parentId INT NOT NULL,
  studentId VARCHAR(20) NOT NULL,
  nannyId VARCHAR(20) NOT NULL, -- References Staff.id
  nannyName VARCHAR(255),
  date DATE NOT NULL,
  startTime TIME,
  endTime TIME,
  duration VARCHAR(50), -- e.g., "3 hours"
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Confirmed, Completed, Cancelled
  notes TEXT,
  totalCost DECIMAL(10, 2),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (parentId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE CASCADE,
  FOREIGN KEY (nannyId) REFERENCES Staff(id) ON DELETE CASCADE
);
