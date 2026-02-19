-- PostgreSQL Schema for KiddoZ Childcare System (DBMS Lab)

-- Define these exact tables with all constraints:
CREATE TABLE programs (
  program_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  monthly_fee DECIMAL(10,2),
  age_min INT,
  age_max INT,
  capacity INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parents (
  parent_id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  emergency_contact VARCHAR(200),
  emergency_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10),
  photo_url TEXT,
  program_id INT REFERENCES programs(program_id),
  primary_parent_id INT REFERENCES parents(parent_id),
  medical_notes TEXT,
  allergies TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE staff (
  staff_id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) CHECK (role IN ('admin', 'teacher', 'caregiver', 'nurse')),
  assigned_program_id INT REFERENCES programs(program_id),
  hire_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE attendance (
  attendance_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id),
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'excused')),
  check_in_time TIME,
  check_out_time TIME,
  marked_by INT REFERENCES staff(staff_id),
  notes TEXT,
  UNIQUE(student_id, date)
);

CREATE TABLE health_records (
  record_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id),
  recorded_by INT REFERENCES staff(staff_id),
  date TIMESTAMP DEFAULT NOW(),
  temperature DECIMAL(4,1),
  mood VARCHAR(50),
  meal_status VARCHAR(50),
  nap_duration_minutes INT,
  observations TEXT,
  is_parent_visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES parents(parent_id),
  student_id INT REFERENCES students(student_id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status VARCHAR(20) CHECK (status IN ('paid', 'pending', 'overdue')),
  payment_method VARCHAR(50),
  month_year VARCHAR(10),
  notes TEXT
);

CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  created_by INT REFERENCES staff(staff_id),
  target_type VARCHAR(20) CHECK (target_type IN ('all', 'parent', 'staff', 'specific')),
  target_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);
