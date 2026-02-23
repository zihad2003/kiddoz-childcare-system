# KiddoZ Relational Database Schema (3NF Optimized)

This project uses a **PostgreSQL** schema designed for the DBMS Lab, strictly adhering to **Third Normal Form (3NF)** to ensure data integrity and remove redundancy.

## Entity Relationship Overview
The system is designed around a central `Users` concept, split into `Parents` and `Staff`.

- **One-to-Many**: `Programs` -> `Students` & `Staff`
- **One-to-Many**: `Parents` -> `Students`
- **One-to-Many**: `Students` -> `Attendance` (Time-series)
- **One-to-Many**: `Students` -> `HealthRecords`
- **One-to-Many**: `Staff` (Teacher/Nurse) -> `HealthRecords` (Recorded By)
- **One-to-Many**: `Incidents` -> `IncidentWitnesses` (Normalized list)

## Primary Entities (3NF Normalized)

### 1. `Students`
Basic profiles. Redundant fields like `current_status` or `last_temp` have been removed to satisfy 3NF. These are now derived via joins with the latest timestamped records in `health_records` or `attendance`.
- `student_id`: SERIAL (PK)
- `program_id`: INT (FK -> programs.program_id)
- `primary_parent_id`: INT (FK -> parents.parent_id)

### 2. `Payments` (Refined for 3NF)
Normalized to handle multiple payment types (Tuition, Salary, Expense) without name redundancy.
- `parent_id`: FK to Parents (Tuition source)
- `staff_id`: FK to Staff (Payroll recipient)
- `type`: ENUM ('Tuition', 'Salary', 'Expense')

### 3. `Incidents` & `IncidentWitnesses`
Normalized to 1NF/3NF by moving the multi-valued `witnesses` attribute into a separate table.
- `incident_id`: SERIAL (PK)
- `witness_name`: Part of composite PK in `incident_witnesses`.

## Normalization Rationale (3NF Compliance)

1.  **First Normal Form (1NF)**:
    *   All tables have a Primary Key.
    *   **Fix**: Multi-valued "witnesses" in incidents moved to `incident_witnesses` table.
2.  **Second Normal Form (2NF)**:
    *   1NF + No partial functional dependencies.
    *   In tables with single-column PKs (SERIAL), 2NF is automatically satisfied.
3.  **Third Normal Form (3NF)**:
    *   2NF + No transitive dependencies.
    *   **Fix**: Removed `current_temp`, `current_mood`, and `attendance_status` from the `students` table. These fields were dependent on the *latest* health/attendance record, not the student ID itself. Storing them in `students` violated 3NF as it created a transitive dependency on the state of another table.

## Complex SQL Queries (3NF Joins)

### 1. Fetching Current Student Status (Replaces Denormalized Fields)
```sql
SELECT s.full_name, h.temperature, a.status
FROM students s
LEFT JOIN health_records h ON h.student_id = s.student_id
LEFT JOIN attendance a ON a.student_id = s.student_id
WHERE h.timestamp = (SELECT MAX(timestamp) FROM health_records WHERE student_id = s.student_id)
  AND a.date = CURRENT_DATE;
```

### 2. Revenue vs Payroll Analysis
```sql
SELECT 
    (SELECT SUM(amount) FROM payments WHERE type = 'Tuition' AND status = 'Paid') as total_revenue,
    (SELECT SUM(amount) FROM payments WHERE type = 'Salary' AND status = 'Paid') as total_payroll;
```

## DBMS Features Utilized
1. **Relational Constraints**: `REFERENCES` ensuring referential integrity.
2. **Atomic Operations**: PostgreSQL transactions for dual-entity updates.
3. **Check Constraints**: Role and Status enums enforced at the database level.

