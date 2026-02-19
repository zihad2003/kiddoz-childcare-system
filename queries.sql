-- DBMS Lab: SQL Queries for KiddoZ System

-- 1. Monthly attendance report per student
SELECT s.full_name, 
       COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS days_present,
       COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS days_absent,
       ROUND(COUNT(CASE WHEN a.status='present' THEN 1 END)::DECIMAL / 
             NULLIF(COUNT(*), 0) * 100, 2) AS attendance_pct
FROM students s
LEFT JOIN attendance a ON s.student_id = a.student_id
WHERE EXTRACT(MONTH FROM a.date) = EXTRACT(MONTH FROM NOW())
GROUP BY s.student_id, s.full_name
ORDER BY attendance_pct DESC;

-- 2. Revenue summary by month
SELECT month_year,
       COUNT(*) AS total_payments,
       SUM(amount) AS total_revenue,
       SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_amount,
       SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) AS overdue_amount
FROM payments
GROUP BY month_year
ORDER BY month_year DESC;

-- 3. Students with outstanding payments
SELECT s.full_name AS student, p.full_name AS parent, p.phone,
       py.amount, py.due_date, py.status
FROM payments py
JOIN students s ON py.student_id = s.student_id
JOIN parents p ON py.parent_id = p.parent_id
WHERE py.status IN ('pending', 'overdue')
ORDER BY py.due_date ASC;

-- 4. Today's health summary for admin
SELECT s.full_name, h.temperature, h.mood, h.meal_status, 
       h.nap_duration_minutes, h.observations, st.full_name AS logged_by
FROM health_records h
JOIN students s ON h.student_id = s.student_id
JOIN staff st ON h.recorded_by = st.staff_id
WHERE DATE(h.date) = CURRENT_DATE
ORDER BY h.date DESC;

-- 5. Enrollment by program
SELECT pr.name AS program, COUNT(s.student_id) AS enrolled,
       pr.capacity, pr.capacity - COUNT(s.student_id) AS available_spots
FROM programs pr
LEFT JOIN students s ON pr.program_id = s.program_id AND s.is_active = TRUE
GROUP BY pr.program_id, pr.name, pr.capacity
ORDER BY pr.name;
