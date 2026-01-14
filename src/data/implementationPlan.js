export const implementationPlan = {
    title: "KiddoZ Childcare System - Comprehensive Feature Implementation Plan",
    features: [
        {
            id: "billing",
            name: "Billing & Financial Management",
            status: "In Progress",
            description: "Automated invoicing, online payments, and subsidy tracking.",
            steps: [
                "Create Pricing Data Models (programsData.js with updated prices)",
                "Create Billing Dashboard (Invoice History, Current Balance)",
                "Implement 'Make Payment' Mock Flow",
                "Add Subsidy Calculation Logic"
            ]
        },
        {
            id: "enrollment",
            name: "Smart Enrollment & Onboarding",
            status: "In Progress",
            description: "Digital forms for medical, dietary, and emergency details.",
            steps: [
                "Enhance existing EnrollmentPage",
                "Add Medical/Dietary Form Steps",
                "Add Emergency Contact Form Steps",
                "Implement PDF Generation for signed forms (Mock)"
            ]
        },
        {
            id: "attendance",
            name: "Attendance & Real-Time Tracking",
            status: "Pending",
            description: "Check-in/check-out systems for children and staff.",
            steps: [
                "Create Attendance Dashboard for Parents (View) and Staff (Action)",
                "Implement QR Code Generation for Check-in",
                "Create Check-in/Check-out Action Logic"
            ]
        },
        {
            id: "communication",
            name: "Parent-Teacher Communication Hub",
            status: "Pending",
            description: "Real-time messaging, daily activity reports, and media sharing.",
            steps: [
                "Create Message Center Component",
                "Implement 'Daily Sheet' View (Meals, Naps, Mood)",
                "Create Photo Gallery Component"
            ]
        },
        {
            id: "health",
            name: "Health & Safety Monitoring",
            status: "Pending",
            description: "Medication tracking, allergy alerts, and incident reporting.",
            steps: [
                "Create Health Profile Component",
                "Implement Medication Schedule Tracker",
                "Create Incident Report Form"
            ]
        },
        {
            id: "curriculum",
            name: "Curriculum & Activity Planning",
            status: "Pending",
            description: "Scheduling workshops, crafting, and play-based learning.",
            steps: [
                "Create Weekly Schedule View",
                "Implement Activity Detail Modal",
                "Allow Staff to Assign Activities to Days"
            ]
        },
        {
            id: "staff",
            name: "Staff Management",
            status: "Pending",
            description: "Rota scheduling, performance tracking, and certifications.",
            steps: [
                "Create Staff Directory",
                "Implement Shift Scheduler",
                "Create Staff Portal for Time Off Requests"
            ]
        }
    ]
};
