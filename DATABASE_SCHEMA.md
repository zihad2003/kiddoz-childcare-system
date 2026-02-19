# KiddoZ Relational Database Schema (MySQL)

This project has been migrated to **MySQL** to satisfy DBMS Lab requirements. The schema follows relational best practices, including 3NF normalization, primary keys, and foreign key constraints.

## Entity Relationship Overview
The system is designed around a central `Users` table with role-based extensions.

- **One-to-Many**: `Users` (Parent) -> `Students`
- **One-to-Many**: `Students` -> `DailyActivities` (Attendance/Meals)
- **One-to-Many**: `Students` -> `HealthRecords`
- **One-to-Many**: `Users` (Staff) -> `Payrolls`
- **One-to-Many**: `Centers` -> `Students` & `Staff`

## Primary Entities (3NF Normalized)

### 1. `Users` (Identity & RBAC)
Primary authentication table. Role-based access control (RBAC) is applied via the `role` enum.
- `id`: UUID (PK)
- `email`: VARCHAR(255) (Unique)
- `password`: VARCHAR(255) (Bcrypt hashed)
- `role`: ENUM ('superadmin', 'admin', 'staff', 'parent', 'nurse', 'nanny')

### 2. `Students` (Core Business Object)
Successfully normalized by separating parent/center links into foreign keys.
- `id`: INT (PK)
- `parentId`: UUID (FK -> Users.id)
- `centerId`: INT (FK -> Centers.id)
- `name`, `dob`, `gender`
- `plan`: VARCHAR(50) (Referencing Pricing Plans)

### 3. `Staff` (Human Resources)
Separated from `Users` to store specific HR/Nanny data.
- `id`: INT (PK)
- `userId`: UUID (FK -> Users.id)
- `specialization`, `experience_years`, `base_salary`
- `status`: ENUM ('active', 'on_leave', 'terminated')

### 4. `DailyActivities` (Attendance & Activity)
Stores time-series data for child monitoring.
- `id`: BIGINT (PK)
- `studentId`: INT (FK -> Students.id)
- `activityType`: VARCHAR(50) (Attendance, Meal, Nap, Mood)
- `value`: VARCHAR(100)
- `timestamp`: DATETIME

### 5. `Payrolls` (Financials)
Handles salary disbursements and expense tracking.
- `id`: INT (PK)
- `staffId`: INT (FK -> Staff.id)
- `amount`: DECIMAL(10,2)
- `status`: ENUM ('pending', 'paid', 'overdue')
- `payDate`: DATE

### 6. `Centers` (Infrastructure)
Allows the platform to scale to multiple childcare locations.
- `id`: INT (PK)
- `name`, `address`, `contactEmail`
- `capacity`: INT

## Normalization Rational (DBMS Lab)
1. **First Normal Form (1NF)**: All tables have primary keys, and all columns contain atomic values. Repeated contact info for multiple children of the same parent is moved to a single `Users` entry.
2. **Second Normal Form (2NF)**: All non-key attributes are fully functional dependent on the primary key. `DailyActivities` depends solely on the `activity_id`, not partially on the student.
3. **Third Normal Form (3NF)**: Transitive dependencies are removed. For example, student `Plan` details (price, duration) are stored in separate configuration or referenced via the API to prevent data redundancy in the `Students` table.

## Complex SQL Queries (For Lab Report)

### 1. Multi-Join: Revenue by Center
```sql
SELECT c.name AS center_name, SUM(p.amount) AS total_revenue
FROM Centers c
JOIN Students s ON c.id = s.centerId
JOIN Billings p ON s.id = p.studentId
WHERE p.status = 'Paid'
GROUP BY c.id;
```

### 2. Subquery: Find High-Performing Staff
```sql
SELECT name FROM Users WHERE id IN (
    SELECT userId FROM Staff WHERE experience_years > 5 AND status = 'active'
);
```

### 3. Aggregation: Daily Attendance Report
```sql
SELECT activityType, value, COUNT(*) as count
FROM DailyActivities
WHERE DATE(timestamp) = CURDATE() AND activityType = 'attendance'
GROUP BY value;
```

## DBMS Features Utilized
1. **Relational Constraints**: Use of `ON DELETE CASCADE` for child records (e.g., deleting a student removes their health records).
2. **ACID Transactions**: Implemented via Sequelize transactions for enrollment (creating User + Student + Billing entry).
3. **Optimized Indexing**: Indexes added to `parentId`, `studentId`, and `email` for O(log n) lookup performance.
