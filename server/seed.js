const { sequelize, User, Staff, Student, Payroll, Task, Notification, HealthRecord, DailyActivity, Billing, NannyBooking, Center, Bulletin } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });

        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash('password123', salt);
        const adminHash = await bcrypt.hash('admin123', salt);

        console.log('Seeding Centers...');
        const centerGulshan = await Center.create({
            name: 'KiddoZ Gulshan',
            location: 'Gulshan 2, Dhaka',
            contactEmail: 'gulshan@kiddoz.com',
            contactPhone: '01711223344',
            capacity: 250,
            status: 'active'
        });

        const centerUttara = await Center.create({
            name: 'KiddoZ Uttara',
            location: 'Sector 4, Uttara, Dhaka',
            contactEmail: 'uttara@kiddoz.com',
            contactPhone: '01711223355',
            capacity: 200,
            status: 'active'
        });

        const centers = [centerGulshan, centerUttara];

        console.log('Seeding Users...');

        // Helper to create user and return id
        const createUser = async (data) => {
            const user = await User.create(data);
            return user;
        };

        const admin = await createUser({ email: 'admin@kiddoz.com', password: adminHash, fullName: 'Admin Iftikhar', role: 'admin', phone: '01700000000', address: 'Dhaka' });
        const superAdmin = await createUser({ email: 'superadmin@kiddoz.com', password: adminHash, fullName: 'Super Admin', role: 'superadmin', phone: '01700000001', address: 'Dhaka HQ' });
        const rahim = await createUser({ email: 'rahim@gmail.com', password: passHash, fullName: 'Rahim Uddin', role: 'parent', phone: '01812345678', address: 'Gulshan, Dhaka' });
        const fatima = await createUser({ email: 'fatima@gmail.com', password: passHash, fullName: 'Fatima Begum', role: 'parent', phone: '01987654321', address: 'Banani, Dhaka' });
        const karim = await createUser({ email: 'karim@gmail.com', password: passHash, fullName: 'Karim Sheikh', role: 'parent', phone: '01711112222', address: 'Uttara, Dhaka' });
        const nasrin = await createUser({ email: 'nasrin@gmail.com', password: passHash, fullName: 'Nasrin Akter', role: 'parent', phone: '01600000000', address: 'Dhanmondi, Dhaka' });
        const jamal = await createUser({ email: 'jamal@gmail.com', password: passHash, fullName: 'Jamal Hossain', role: 'parent', phone: '01555555555', address: 'Mirpur, Dhaka' });
        const tahmina = await createUser({ email: 'tahmina@gmail.com', password: passHash, fullName: 'Tahmina Khan', role: 'parent', phone: '01888888888', address: 'Bashundhara, Dhaka' });
        const rafiq = await createUser({ email: 'rafiq@gmail.com', password: passHash, fullName: 'Rafiqul Islam', role: 'parent', phone: '01999999999', address: 'Mohammadpur, Dhaka' });
        const shirin = await createUser({ email: 'shirin@gmail.com', password: passHash, fullName: 'Shirin Jahan', role: 'parent', phone: '01333333333', address: 'Badda, Dhaka' });
        const monir = await createUser({ email: 'monir@gmail.com', password: passHash, fullName: 'Moniruzzaman', role: 'parent', phone: '01444444444', address: 'Tejgaon, Dhaka' });

        console.log('Seeding Students...');

        console.log('Seeding Students...');

        // Helper for random data
        const plans = ['Growth Scholar', 'Little Explorer', 'VIP Guardian'];
        const statuses = ['Present', 'Absent', 'Late'];
        const moods = ['Happy', 'Calm', 'Energetic', 'Tired', 'Playful', 'Crying'];
        const firstNames = ['Ayan', 'Sara', 'Ishraq', 'Nabila', 'Zayn', 'Rehan', 'Samia', 'Fahad', 'Zara', 'Arif', 'Tanisha', 'Rohan', 'Meher', 'Kavya', 'Aryan', 'Simra', 'Aarav', 'Nusrat', 'Ibrahim', 'Fatima', 'Yusuf', 'Mariam', 'Bilal', 'Aisha', 'Omar', 'Khadija', 'Ali', 'Zainab', 'Hassan', 'Hafsa'];
        const lastNames = ['Uddin', 'Begum', 'Sheikh', 'Akter', 'Hossain', 'Khan', 'Islam', 'Jahan', 'Monir', 'Rahman', 'Chowdhury', 'Ahmed', 'Siddique', 'Mirza', 'Talukder'];

        const studentsData = [];
        const parents = [rahim, fatima, karim, nasrin, jamal, tahmina, rafiq, shirin, monir];

        for (let i = 1; i <= 50; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const parent = parents[Math.floor(Math.random() * parents.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            studentsData.push({
                id: `S-${1000 + i}`,
                parentId: parent.id,
                parentName: parent.fullName,
                centerId: centers[i % centers.length].id,
                name: `${firstName} ${lastName}`,
                age: Math.floor(Math.random() * 4) + 2, // 2-5 years old
                plan: plans[Math.floor(Math.random() * plans.length)],
                attendance: status,
                temp: status === 'Absent' ? '-' : (98 + Math.random()).toFixed(1),
                mood: status === 'Absent' ? '-' : moods[Math.floor(Math.random() * moods.length)],
                meal: status === 'Absent' ? '-' : (Math.random() > 0.2 ? 'Finished' : 'Half Eaten')
            });
        }

        await Student.bulkCreate(studentsData);
        console.log(`Seeded ${studentsData.length} students`);


        // --- 3. Seed Staff (50 members) ---
        const nannyNames = ['Salma Khatun', 'Moushumi Akter', 'Kamal Hasan', 'Rehana Begum', 'Nasima Akter', 'Sultana Razia', 'Amina Khatun', 'Rahima Begum', 'Taslima Akter', 'Hosne Ara', 'Shamima Begum', 'Roksana Parvin', 'Mahmuda Akter', 'Jesmin Nahar', 'Shahnaz Begum', 'Monowara Begum', 'Aleya Khatun', 'Farida Yasmin', 'Sabina Akter', 'Nazma Begum'];
        const nurseNames = ['Farhana Rahman', 'Nusrat Jahan', 'Sadia Islam', 'Tahmina Akter', 'Shahana Parveen', 'Rubina Khatun', 'Dilruba Yasmin', 'Farzana Ahmed', 'Sharmin Sultana', 'Ayesha Siddika', 'Mahfuza Begum', 'Rowshan Ara', 'Kamrun Nahar', 'Shapla Akter', 'Lovely Khatun'];
        const teacherNames = ['Rokeya Sultana', 'Sumaiya Islam', 'Sharmin Jahan', 'Tasnuva Rahman', 'Fahmida Khatun', 'Nargis Akter', 'Rupa Begum', 'Shirin Akter'];
        const driverNames = ['Abul Kalam', 'Rafiqul Islam', 'Jahangir Alam'];
        const cookNames = ['Bilkis Begum', 'Rahela Khatun'];
        const securityNames = ['Jahor Ali', 'Motaleb Hossain'];

        const areas = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara', 'Mirpur', 'Mohammadpur', 'Badda', 'Tejgaon', 'Khilgaon'];
        const availabilityOptions = ['Available', 'Busy', 'Shift', 'On Leave'];

        const staffData = [];
        let staffId = 1;

        // Add 20 Nannies
        nannyNames.forEach((name, index) => {
            const specialties = ['Infant Care', 'Toddlers', 'Active Play', 'Newborn Care', 'Special Needs', 'Night Care'];
            staffData.push({
                id: `ST-${String(staffId++).padStart(3, '0')}`,
                name: name,
                role: 'Nanny',
                centerId: centers[index % centers.length].id,
                experience: `${Math.floor(Math.random() * 10) + 2} Years`,
                specialty: specialties[index % specialties.length],
                rate: 250 + Math.floor(Math.random() * 150),
                area: areas[index % areas.length],
                availability: availabilityOptions[index % 3],
                img: `https://randomuser.me/api/portraits/women/${index + 10}.jpg`
            });
        });

        // Add 15 Nurses
        nurseNames.forEach((name, index) => {
            const specialties = ['First Aid', 'Pediatric Care', 'Emergency Care', 'Vaccination', 'Health Monitoring', 'Medical Records'];
            staffData.push({
                id: `ST-${String(staffId++).padStart(3, '0')}`,
                name: name,
                role: 'Nurse',
                centerId: centers[index % centers.length].id,
                experience: `${Math.floor(Math.random() * 12) + 3} Years`,
                specialty: specialties[index % specialties.length],
                rate: 500 + Math.floor(Math.random() * 200),
                area: areas[index % areas.length],
                availability: availabilityOptions[index % 3],
                img: `https://randomuser.me/api/portraits/women/${index + 30}.jpg`
            });
        });

        // Add 8 Teachers
        teacherNames.forEach((name, index) => {
            const specialties = ['Early Childhood', 'Art & Craft', 'English Basics', 'Math & Science', 'Music & Dance', 'Physical Education', 'Montessori', 'Language Development'];
            staffData.push({
                id: `ST-${String(staffId++).padStart(3, '0')}`,
                name: name,
                role: 'Teacher',
                centerId: centers[index % centers.length].id,
                experience: `${Math.floor(Math.random() * 10) + 4} Years`,
                specialty: specialties[index % specialties.length],
                rate: 450 + Math.floor(Math.random() * 200),
                area: areas[index % areas.length],
                availability: availabilityOptions[index % 3],
                img: `https://randomuser.me/api/portraits/women/${index + 50}.jpg`
            });
        });

        // Add 3 Drivers
        driverNames.forEach((name, index) => {
            staffData.push({
                id: `ST-${String(staffId++).padStart(3, '0')}`,
                name: name,
                role: 'Driver',
                experience: `${Math.floor(Math.random() * 15) + 5} Years`,
                specialty: 'Safe Driving',
                rate: 180 + Math.floor(Math.random() * 50),
                area: areas[index % areas.length],
                availability: index === 0 ? 'Busy' : 'Available',
                img: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`
            });
        });

        // Add 2 Cooks
        cookNames.forEach((name, index) => {
            staffData.push({
                id: `ST-${String(staffId++).padStart(3, '0')}`,
                name: name,
                role: 'Cook',
                experience: `${Math.floor(Math.random() * 15) + 8} Years`,
                specialty: index === 0 ? 'Healthy Meals' : 'Nutritious Food',
                rate: 200 + Math.floor(Math.random() * 50),
                area: areas[index % areas.length],
                availability: 'Shift',
                img: `https://randomuser.me/api/portraits/women/${index + 60}.jpg`
            });
        });

        // Add 2 Security
        securityNames.forEach((name, index) => {
            staffData.push({
                id: `ST-${String(staffId++).padStart(3, '0')}`,
                name: name,
                role: 'Security',
                experience: `${Math.floor(Math.random() * 10) + 3} Years`,
                specialty: index === 0 ? 'Gatekeeping' : 'Campus Security',
                rate: 150 + Math.floor(Math.random() * 30),
                area: areas[index % areas.length],
                availability: 'Shift',
                img: `https://randomuser.me/api/portraits/men/${index + 10}.jpg`
            });
        });

        await Staff.bulkCreate(staffData);
        console.log(`Seeded ${staffData.length} staff members`);

        // --- 4. Seed Payroll ---
        // Helper to get past date
        const daysAgo = (days) => {
            const d = new Date();
            d.setDate(d.getDate() - days);
            return d.toISOString().split('T')[0];
        };

        const payrollData = [
            { recipientName: 'Salma Khatun', role: 'Nanny', amount: 300, status: 'Pending', type: 'Salary', date: daysAgo(2) },
            { recipientName: 'Rokeya Sultana', role: 'Teacher', amount: 500, status: 'Paid', type: 'Salary', date: daysAgo(5) },
            { recipientName: 'Abul Kalam', role: 'Driver', amount: 200, status: 'Pending', type: 'Salary', date: daysAgo(1) },
            { recipientName: 'CleanCo Services', role: 'Vendor', amount: 1200, status: 'Pending', type: 'Maintenance', date: daysAgo(3) },
            { recipientName: 'Moushumi Akter', role: 'Nanny', amount: 250, status: 'Paid', type: 'Bonus', date: daysAgo(10) },
            { recipientName: 'Farhana Rahman', role: 'Nurse', amount: 600, status: 'Paid', type: 'Salary', date: daysAgo(6) },
            { recipientName: 'City Power', role: 'Utility', amount: 450, status: 'Overdue', type: 'Bill', date: daysAgo(15) },
            { recipientName: 'Fresh Foods Ltd', role: 'Vendor', amount: 800, status: 'Pending', type: 'Supplies', date: daysAgo(4) },
            { recipientName: 'Sumaiya Islam', role: 'Teacher', amount: 450, status: 'Paid', type: 'Salary', date: daysAgo(7) },
            { recipientName: 'KiddoZ Rent', role: 'Admin', amount: 2500, status: 'Paid', type: 'Rent', date: daysAgo(30) }
        ];
        await Payroll.bulkCreate(payrollData);
        console.log(`Seeded ${payrollData.length} payroll records`);

        // --- 5. Seed Tasks ---
        const tasksData = [
            { title: 'Update vaccination records for Ayan', assignedTo: 'Nurse', completed: false, createdBy: 'admin@kiddoz.com' },
            { title: 'Prepare art supplies for Class B', assignedTo: 'Teacher', completed: true, createdBy: 'admin@kiddoz.com', completedBy: 'rokeya@kiddoz.com', completedAt: new Date() },
            { title: 'Fix leak in kitchen sink', assignedTo: 'All', completed: false, createdBy: 'admin@kiddoz.com' },
            { title: 'Organize parents meeting agenda', assignedTo: 'Admin', completed: false, createdBy: 'admin@kiddoz.com' },
            { title: 'Weekly toy categorization', assignedTo: 'Nanny', completed: true, createdBy: 'admin@kiddoz.com', completedBy: 'salma@kiddoz.com', completedAt: new Date() }
        ];
        await Task.bulkCreate(tasksData);
        console.log(`Seeded ${tasksData.length} tasks`);

        // --- 5.1 Seed CareTasks ---
        const careTasksData = [];
        const careTypes = ['Diaper Change', 'Feed', 'Nap', 'Medicine'];
        const carePriorities = ['High', 'Medium', 'Low'];
        const careTimes = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

        // Generate tasks for the first 10 students
        for (let i = 0; i < 10; i++) {
            const student = studentsData[i];
            // 2-3 tasks per student
            const numTasks = Math.floor(Math.random() * 2) + 2;
            for (let j = 0; j < numTasks; j++) {
                careTasksData.push({
                    id: `CT-${i}-${j}`,
                    scheduledTime: careTimes[j % careTimes.length],
                    type: careTypes[Math.floor(Math.random() * careTypes.length)],
                    priority: carePriorities[Math.floor(Math.random() * carePriorities.length)],
                    studentId: student.id,
                    studentName: student.name,
                    group: student.age <= 2 ? 'Infant' : (student.age <= 4 ? 'Toddler' : 'Preschool'),
                    status: Math.random() > 0.7 ? 'Completed' : 'Pending',
                    details: 'Routine care',
                    date: new Date()
                });
            }
        }
        await sequelize.models.CareTask.bulkCreate(careTasksData);
        console.log(`Seeded ${careTasksData.length} care tasks`);

        // --- 6. Seed Notifications ---
        const notificationsData = [
            { title: 'New Student Enrollment', message: 'Ayan Uddin has joined the Growth Scholar plan.', type: 'info', targetRole: 'admin' },
            { title: 'Payment Pending', message: 'Salma Khatun salary is pending approval.', type: 'warning', targetRole: 'admin' },
            { title: 'System Update', message: 'The server will undergo maintenance tonight at 2 AM.', type: 'system', targetRole: 'all' },
            { title: 'Low Inventory', message: 'Diaper stock is running low in Storage Room B.', type: 'admin', targetRole: 'staff' },
            { title: 'Staff Meeting', message: 'Weekly staff meeting scheduled for Sunday 10 AM.', type: 'info', targetRole: 'staff' },
            { title: 'Welcome to KiddoZ', message: 'We are excited to launch our new parent portal!', type: 'info', targetRole: 'parent' }
        ];
        await Notification.bulkCreate(notificationsData);
        console.log(`Seeded ${notificationsData.length} notifications`);

        // --- 7. Seed Health Records ---
        const healthRecordsData = [];
        const recordTypes = ['Vaccination', 'Checkup', 'Allergy Test', 'Medical Report'];

        // Add health records for first 15 students
        for (let i = 0; i < 15; i++) {
            const student = studentsData[i];
            const numRecords = Math.floor(Math.random() * 3) + 1; // 1-3 records per student

            for (let j = 0; j < numRecords; j++) {
                healthRecordsData.push({
                    studentId: student.id,
                    recordType: recordTypes[Math.floor(Math.random() * recordTypes.length)],
                    fileName: `${student.name.replace(' ', '_')}_${recordTypes[j % recordTypes.length]}.pdf`,
                    fileUrl: `/uploads/health/${student.id}_record_${j}.pdf`,
                    description: `${recordTypes[j % recordTypes.length]} record for ${student.name}`,
                    uploadedBy: 'Nurse Farhana',
                    uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
                });
            }
        }
        await HealthRecord.bulkCreate(healthRecordsData);
        console.log(`Seeded ${healthRecordsData.length} health records`);

        // --- 8. Seed Daily Activities ---
        const dailyActivitiesData = [];
        const activityTypes = ['meal', 'nap', 'mood', 'temperature', 'diaper'];
        const mealValues = ['Finished', 'Half Eaten', 'Did not eat', 'Ate well'];
        const napValues = ['1 hour', '2 hours', '30 minutes', 'No nap'];
        const tempValues = ['98.4°F', '98.6°F', '98.7°F', '99.0°F', '98.3°F'];

        // Generate activities for all students for the last 3 days
        for (let day = 0; day < 3; day++) {
            for (const student of studentsData.slice(0, 20)) { // First 20 students
                const date = new Date();
                date.setDate(date.getDate() - day);

                // Morning temperature
                dailyActivitiesData.push({
                    studentId: student.id,
                    activityType: 'temperature',
                    value: tempValues[Math.floor(Math.random() * tempValues.length)],
                    details: 'Morning checkup',
                    timestamp: new Date(date.setHours(9, 0, 0)),
                    recordedBy: 'Nurse Farhana'
                });

                // Breakfast
                dailyActivitiesData.push({
                    studentId: student.id,
                    activityType: 'meal',
                    value: mealValues[Math.floor(Math.random() * mealValues.length)],
                    details: 'Breakfast - Oatmeal and fruits',
                    timestamp: new Date(date.setHours(9, 30, 0)),
                    recordedBy: 'Teacher Rokeya'
                });

                // Morning mood
                dailyActivitiesData.push({
                    studentId: student.id,
                    activityType: 'mood',
                    value: moods[Math.floor(Math.random() * moods.length)],
                    details: 'Morning assessment',
                    timestamp: new Date(date.setHours(10, 0, 0)),
                    recordedBy: 'Teacher Rokeya'
                });

                // Nap time
                dailyActivitiesData.push({
                    studentId: student.id,
                    activityType: 'nap',
                    value: napValues[Math.floor(Math.random() * napValues.length)],
                    details: 'Afternoon nap',
                    timestamp: new Date(date.setHours(13, 0, 0)),
                    recordedBy: 'Nanny Salma'
                });

                // Lunch
                dailyActivitiesData.push({
                    studentId: student.id,
                    activityType: 'meal',
                    value: mealValues[Math.floor(Math.random() * mealValues.length)],
                    details: 'Lunch - Rice, vegetables, and chicken',
                    timestamp: new Date(date.setHours(12, 0, 0)),
                    recordedBy: 'Cook Bilkis'
                });
            }
        }
        await DailyActivity.bulkCreate(dailyActivitiesData);
        console.log(`Seeded ${dailyActivitiesData.length} daily activities`);

        // --- 9. Seed Billing ---
        const billingData = [];
        const billingStatuses = ['Pending', 'Paid', 'Overdue'];

        // Create billing records for each parent
        for (const parent of parents) {
            // Get students for this parent
            const parentStudents = studentsData.filter(s => s.parentId === parent.id);

            if (parentStudents.length > 0) {
                // Monthly tuition for each student
                for (const student of parentStudents) {
                    const planCosts = { 'Growth Scholar': 5000, 'Little Explorer': 4000, 'VIP Guardian': 7000 };
                    const amount = planCosts[student.plan] || 5000;

                    // Current month bill
                    billingData.push({
                        parentId: parent.id,
                        studentId: student.id,
                        amount: amount,
                        dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
                        status: Math.random() > 0.7 ? 'Paid' : 'Pending',
                        description: `Monthly tuition for ${student.name} - ${student.plan}`,
                        plan: student.plan,
                        invoiceNumber: `INV-${Date.now()}-${student.id}`
                    });

                    // Previous month bill (paid)
                    billingData.push({
                        parentId: parent.id,
                        studentId: student.id,
                        amount: amount,
                        dueDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 25),
                        status: 'Paid',
                        description: `Monthly tuition for ${student.name} - ${student.plan}`,
                        plan: student.plan,
                        invoiceNumber: `INV-${Date.now() - 1000000}-${student.id}`
                    });
                }
            }
        }
        await Billing.bulkCreate(billingData);
        console.log(`Seeded ${billingData.length} billing records`);

        // --- 10. Seed Nanny Bookings ---
        const nannyBookingsData = [];
        const nannies = staffData.filter(s => s.role === 'Nanny');
        const bookingStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

        // Create bookings for some parents
        for (let i = 0; i < 10; i++) {
            const parent = parents[i % parents.length];
            const parentStudents = studentsData.filter(s => s.parentId === parent.id);

            if (parentStudents.length > 0) {
                const student = parentStudents[0];
                const nanny = nannies[Math.floor(Math.random() * nannies.length)];
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 14) + 1);

                const duration = Math.floor(Math.random() * 4) + 2; // 2-5 hours
                const totalCost = duration * nanny.rate;

                nannyBookingsData.push({
                    parentId: parent.id,
                    studentId: student.id,
                    nannyId: nanny.id,
                    nannyName: nanny.name,
                    date: futureDate,
                    startTime: '14:00:00',
                    endTime: `${14 + duration}:00:00`,
                    duration: `${duration} hours`,
                    status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
                    notes: `Requested ${nanny.specialty} services for ${student.name}`,
                    totalCost: totalCost
                });
            }
        }
        // Create more bookings... (omitted for brevity)
        await NannyBooking.bulkCreate(nannyBookingsData);
        console.log(`Seeded ${nannyBookingsData.length} nanny bookings`);

        // --- 11. Seed Bulletins ---
        console.log('Seeding Bulletins...');
        const bulletinsData = [
            { title: 'System Infrastructure Upgrade', content: 'We are upgrading our core servers this Sunday. Expect minor blips between 2 AM and 4 AM.', category: 'Maintenance', priority: 'High', status: 'Published' },
            { title: 'Spring Festival 2026', content: 'Join us for the annual KiddoZ Spring Festival! Games, food, and fun for all students and parents.', category: 'Event', priority: 'Medium', status: 'Published' },
            { title: 'New Vaccination Policy', content: 'Updated health guidelines require all students to have the latest flu shots by next month.', category: 'Policy', priority: 'Critical', status: 'Published' },
            { title: 'Extended Hours Now Available', content: 'By popular demand, we are extending our closing time to 7 PM at the Gulshan center.', category: 'Announcement', priority: 'Low', status: 'Published' },
            { title: 'Monthly Staff Excellence Award', content: 'Congratulations to Teacher Rokeya for her outstanding contribution to student development!', category: 'Announcement', priority: 'Medium', status: 'Published' }
        ];
        await Bulletin.bulkCreate(bulletinsData);
        console.log(`Seeded ${bulletinsData.length} bulletins`);

        // --- 12. More Financial Data for Richer Charts ---
        console.log('Seeding more financial records...');
        const moreBilling = [];
        for (let i = 2; i <= 6; i++) { // Previous 5 months
            for (const parent of parents.slice(0, 5)) {
                const amount = 4000 + Math.floor(Math.random() * 3000);
                moreBilling.push({
                    parentId: parent.id,
                    amount: amount,
                    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() - i, 25),
                    status: 'Paid',
                    description: `Historical tuition - Month ${-i}`,
                    invoiceNumber: `INV-HIST-${i}-${parent.id}`
                });
            }
        }
        await Billing.bulkCreate(moreBilling);

        const morePayroll = [];
        for (let i = 1; i <= 4; i++) {
            staffData.slice(0, 10).forEach(staff => {
                morePayroll.push({
                    recipientName: staff.name,
                    role: staff.role,
                    amount: staff.rate || 300,
                    status: 'Paid',
                    type: 'Salary',
                    date: daysAgo(30 * i)
                });
            });
        }
        await Payroll.bulkCreate(morePayroll);

        console.log('Database seeded successfully completely.');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};


seed();
