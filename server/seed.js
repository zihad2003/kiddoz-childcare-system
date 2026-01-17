const { sequelize, User, Staff, Student, Payroll, Task, Notification } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });

        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash('password123', salt);
        const adminHash = await bcrypt.hash('admin123', salt);

        console.log('Seeding Users...');

        // Helper to create user and return id
        const createUser = async (data) => {
            const user = await User.create(data);
            return user;
        };

        const admin = await createUser({ email: 'admin@kiddoz.com', password: adminHash, fullName: 'Admin Iftikhar', role: 'admin', phone: '01700000000', address: 'Dhaka' });
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

        // --- 3. Seed Staff ---
        const staffData = [
            { id: 'ST-001', name: 'Salma Khatun', role: 'Nanny', experience: '5 Years', specialty: 'Infant Care', rate: 300, area: 'Gulshan', availability: 'Available', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
            { id: 'ST-002', name: 'Rokeya Sultana', role: 'Teacher', experience: '8 Years', specialty: 'Early Childhood', rate: 500, area: 'Bashundhara', availability: 'Available', img: 'https://randomuser.me/api/portraits/women/2.jpg' },
            { id: 'ST-003', name: 'Abul Kalam', role: 'Driver', experience: '10 Years', specialty: 'Safe Driving', rate: 200, area: 'Uttara', availability: 'Busy', img: 'https://randomuser.me/api/portraits/men/1.jpg' },
            { id: 'ST-004', name: 'Moushumi Akter', role: 'Nanny', experience: '3 Years', specialty: 'Toddlers', rate: 250, area: 'Dhanmondi', availability: 'Available', img: 'https://randomuser.me/api/portraits/women/3.jpg' },
            { id: 'ST-005', name: 'Farhana Rahman', role: 'Nurse', experience: '6 Years', specialty: 'First Aid', rate: 600, area: 'Banani', availability: 'Available', img: 'https://randomuser.me/api/portraits/women/4.jpg' },
            { id: 'ST-006', name: 'Jahor Ali', role: 'Security', experience: '4 Years', specialty: 'Gatekeeping', rate: 150, area: 'Mirpur', availability: 'Shift', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
            { id: 'ST-007', name: 'Sumaiya Islam', role: 'Teacher', experience: '5 Years', specialty: 'Art & Craft', rate: 450, area: 'Mohammadpur', availability: 'Available', img: 'https://randomuser.me/api/portraits/women/5.jpg' },
            { id: 'ST-008', name: 'Bilkis Begum', role: 'Cook', experience: '12 Years', specialty: 'Healthy Meals', rate: 200, area: 'Badda', availability: 'Shift', img: 'https://randomuser.me/api/portraits/women/6.jpg' },
            { id: 'ST-009', name: 'Kamal Hasan', role: 'Nanny', experience: '4 Years', specialty: 'Active Play', rate: 280, area: 'Tejgaon', availability: 'Available', img: 'https://randomuser.me/api/portraits/men/3.jpg' },
            { id: 'ST-010', name: 'Sharmin Jahan', role: 'Teacher', experience: '7 Years', specialty: 'English Basics', rate: 550, area: 'Gulshan', availability: 'Available', img: 'https://randomuser.me/api/portraits/women/7.jpg' }
        ];
        await Staff.bulkCreate(staffData);
        console.log(`Seeded ${staffData.length} staff members`);

        // --- 4. Seed Payroll ---
        const payrollData = [
            { recipientName: 'Salma Khatun', role: 'Nanny', amount: 300, status: 'Pending', type: 'Salary', date: '2023-11-01' },
            { recipientName: 'Rokeya Sultana', role: 'Teacher', amount: 500, status: 'Paid', type: 'Salary', date: '2023-10-28' },
            { recipientName: 'Abul Kalam', role: 'Driver', amount: 200, status: 'Pending', type: 'Salary', date: '2023-11-05' },
            { recipientName: 'CleanCo Services', role: 'Vendor', amount: 1200, status: 'Pending', type: 'Maintenance', date: '2023-11-02' },
            { recipientName: 'Moushumi Akter', role: 'Nanny', amount: 250, status: 'Paid', type: 'Bonus', date: '2023-10-15' }
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

        // --- 6. Seed Notifications ---
        const notificationsData = [
            { title: 'New Student Enrollment', message: 'Ayan Uddin has joined the Growth Scholar plan.', type: 'info' },
            { title: 'Payment Pending', message: 'Salma Khatun salary is pending approval.', type: 'warning' },
            { title: 'System Update', message: 'The server will undergo maintenance tonight at 2 AM.', type: 'system' },
            { title: 'Low Inventory', message: 'Diaper stock is running low in Storage Room B.', type: 'admin' },
            { title: 'Staff Meeting', message: 'Weekly staff meeting scheduled for Sunday 10 AM.', type: 'info' }
        ];
        await Notification.bulkCreate(notificationsData);
        console.log(`Seeded ${notificationsData.length} notifications`);

        console.log('Database seeded successfully completely.');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};


seed();
