-- PostgreSQL Schema for KiddoZ Childcare System (DBMS Lab) - 3NF Normalized

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
  role VARCHAR(50) CHECK (role IN ('superadmin', 'admin', 'teacher', 'nanny', 'nurse')),
  assigned_program_id INT REFERENCES programs(program_id),
  rate DECIMAL(10,2),
  specialty VARCHAR(200),
  hire_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE attendance (
  attendance_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id),
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
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
  timestamp TIMESTAMP DEFAULT NOW(),
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
  staff_id INT REFERENCES staff(staff_id),
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('Tuition', 'Salary', 'Expense')),
  status VARCHAR(20) CHECK (status IN ('Paid', 'Pending', 'Overdue', 'Failed')),
  payment_date DATE,
  due_date DATE,
  method VARCHAR(50),
  transaction_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info',
  target_role VARCHAR(20) DEFAULT 'all',
  created_by INT REFERENCES staff(staff_id),
  created_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE incidents (
  incident_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id),
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  description TEXT NOT NULL,
  location VARCHAR(100),
  action_taken TEXT,
  status VARCHAR(20) DEFAULT 'Open',
  reported_by INT REFERENCES staff(staff_id),
  teacher_signature VARCHAR(100),
  reported_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE TABLE incident_witnesses (
  incident_id INT REFERENCES incidents(incident_id),
  witness_name VARCHAR(200),
  PRIMARY KEY (incident_id, witness_name)
);

CREATE TABLE tasks (
  task_id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  assigned_to_role VARCHAR(50) DEFAULT 'All',
  is_completed BOOLEAN DEFAULT FALSE,
  created_by INT REFERENCES staff(staff_id),
  completed_by INT REFERENCES staff(staff_id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

