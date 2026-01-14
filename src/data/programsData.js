import daycareImg from '../assets/images/landing/daycare.png';
import preschoolImg from '../assets/images/landing/preschool.png';
import nannyImg from '../assets/images/landing/nanny.png';

export const programsData = [
    {
        id: 'daycare',
        title: 'Nurturing Day Care',
        price: 1200,
        billingPeriod: 'Monthly',
        age: '6 months - 3 years',
        shortDesc: 'A safe haven for your little ones while you work. We prioritize emotional security, sensory play, and routine monitoring to ensure your child feels at home.',
        fullDesc: 'Our Nurturing Day Care program is designed to provide a warm, secure, and stimulating environment for infants and toddlers. We understand that leaving your child is a big step, so we focus on building trust and maintaining close communication with parents. Our certified caregivers are trained in early child development and provide personalized attention to every child.',
        img: daycareImg,
        features: ['Real-time Diaper/Feed Logs', 'Sensory Development', 'Organic Meal Plans', 'Secure Nap Rooms', 'Music & Movement', 'Outdoor Stroller Walks'],
        schedule: '8:00 AM - 6:00 PM',
        capacity: '1:3 Ratio'
    },
    {
        id: 'preschool',
        title: 'Pre-School Excellence',
        price: 950,
        billingPeriod: 'Monthly',
        age: '3 years - 5 years',
        shortDesc: 'Preparing young minds for the future. Our curriculum balances academic foundations like phonics and math with crucial social skills and creative expression.',
        fullDesc: 'The Pre-School Excellence program is where curiosity meets structured learning. We utilize a play-based curriculum that introduces core concepts in literacy, mathematics, and science, while effectively fostering social-emotional growth. Children learn to collaborate, solve problems, and express themselves confidently.',
        img: preschoolImg,
        features: ['Early Literacy & STEM', 'Social Group Dynamics', 'Creative Arts Studio', 'School Readiness', 'Language Immersion', 'Field Trips'],
        schedule: '8:30 AM - 3:30 PM',
        capacity: '1:8 Ratio'
    },
    {
        id: 'nanny',
        title: 'Professional Nanny Service',
        price: 35,
        billingPeriod: 'Hourly',
        age: 'All Ages (Home Service)',
        shortDesc: 'Need extra help at home? KiddoZ allows you to book certified, background-checked nannies for evening care, weekends, or emergency support.',
        fullDesc: 'KiddoZ Professional Nanny Service extends our high standards of care to your home. Whether you need a date-night sitter, weekend support, or temporary care during school holidays, our app connects you with trusted professionals who have passed our rigorous vetting process.',
        img: nannyImg,
        features: ['Background Checked', 'First Aid Certified', 'Flexible Booking', 'App-Based Tracking', 'Homework Help', 'Light Housekeeping'],
        schedule: 'Flexible',
        capacity: '1:1 or Sibling Care'
    }
];
