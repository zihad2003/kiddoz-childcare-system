/**
 * Manual Question and Answer library for KiddoZ Chatbot.
 * Matches keywords or phrases in user messages to provide predefined responses.
 */

const manualQA = [
    {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'anyone there'],
        answer: "Assalamu Alaikum! I'm so glad you've reached out to KiddoZ. 😊 I'm here to help you with anything you need to know about our center. How is your day going? What can I do for you?"
    },
    {
        keywords: ['operating hours', 'hours', 'open', 'time', 'timing', 'schedule', 'when do you close'],
        answer: "We love seeing the children every weekday! Our center is open from Monday to Friday, starting at 7:00 AM until 6:00 PM. We take a little break on weekends, but we're ready to welcome everyone back first thing Monday morning! Would you like to schedule a time to drop by and see us? ⏰"
    },
    {
        keywords: ['location', 'address', 'where', 'place', 'map', 'directions'],
        answer: "We are located in a very safe and convenient spot at 123 Main Street, Dhaka. It's a wonderful neighborhood! Would you like to come by for a visit? I can help you arrange a tour if you'd like to see our play areas! 📍"
    },
    {
        keywords: ['price', 'cost', 'fees', 'tuition', 'monthly', 'how much', 'payment'],
        answer: "We try to keep our plans as simple and supportive as possible. Our monthly tuition is $1200 for Infants, $1000 for Toddlers, and $900 for our Preschool children. This covers everything—security, health monitoring, and all their fresh meals! Do you have a specific age group in mind for your child so I can give you more details? 🏷️"
    },
    {
        keywords: ['sibling', 'discount', 'family discount'],
        answer: "We absolutely love it when siblings join our KiddoZ family! To help out, we offer a warm 10% discount on the tuition for your second child. It's our way of saying thank you for trusting us with your family. Does your older child already go to a school, or are you looking to enroll both together? 👨‍👩‍👧‍👦"
    },
    {
        keywords: ['enroll', 'register', 'join', 'admission', 'apply', 'signup'],
        answer: "It would be an honor to have your little one join us! The journey starts with a quick online registration, and then we invite you in to meet our teachers. We want you to feel 100% comfortable before we finalize everything. Would you like me to guide you to the registration form? 📝"
    },
    {
        keywords: ['ratio', 'how many children', 'staff count', 'child per teacher'],
        answer: "We believe every child needs individual love and attention. That's why we keep our teams small: 1 teacher for 3 infants, 1 for 4 toddlers, and 1 for 6 older children. This way, your child is part of our family! Is there a particular age group you'd like to know more about regarding our care? 🛡️"
    },
    {
        keywords: ['yolo', 'camera', 'surveillance', 'tracking', 'ai', 'video', 'live feed', 'safety'],
        answer: "Your child's safety is everything to us. We use an advanced safety system to monitor everything in real-time, which you can check yourself right from your parent dashboard anytime! Would you like to know more about how our parent dashboard works for safety? 🤖📷"
    },
    {
        keywords: ['meal', 'food', 'breakfast', 'lunch', 'eat', 'diet', 'menu', 'snack'],
        answer: "Our kids eat very well! Our chef prepares fresh breakfast, lunch, and two healthy snacks every day. We are strictly nut-free and very careful about allergies. Does your child have any specific dietary needs or favorite foods I should know about? 🍎🥣"
    },
    {
        keywords: ['vacation', 'holiday', 'closed', 'calendar', 'breaks'],
        answer: "We follow the official holiday schedule for Dhaka. You can always find our full, updated calendar in the Bulletins section of your app! Are you planning a family vacation soon and need to check specific dates? 📅"
    },
    {
        keywords: ['contact', 'phone', 'call', 'email', 'support', 'help'],
        answer: "We're always just a phone call away! You can reach us at +880-1234-56789, or if you prefer typing, email us at support@kiddoz.com. Would you like me to have one of our staff members call you back directly? 📞📧"
    },
    {
        keywords: ['teacher', 'staff', 'qualifications', 'background check', 'who is teaching'],
        answer: "Our teachers are the heart of KiddoZ. Every single one is a certified professional who truly loves working with children! Would you like to know more about the specific experience or background of the teachers in your child's age group? 🎓"
    },
    {
        keywords: ['tour', 'visit', 'see the place', 'appointment', 'viewing'],
        answer: "We'd love to meet you in person! You can quickly book a time through the 'Tour Booking' page in the menu. Or would you like me to help you pick a day next week for a personal viewing? 🏫✨"
    },
    {
        keywords: ['nanny', 'babysitter', 'extra care', 'booking nanny'],
        answer: "Life gets busy, and we're here to help! We offer wonderful nanny services for when you need care outside of our regular hours. You can book an amazing nanny right through your dashboard. Would you like to know how our nanny booking process works? 🤱"
    },
    {
        keywords: ['emergency', 'accident', 'sick', 'hospital'],
        answer: "We take safety very seriously with a certified plan in place and immediate parent contact. Our staff is fully trained in first aid for your peace of mind. Would you like to review our full safety and emergency policy? 🚑🚨"
    },
    {
        keywords: ['program', 'curriculum', 'learn', 'activities', 'study'],
        answer: "We believe children learn best when they're having fun! Our program focuses on play-based learning and creative adventures every day. Is there a specific skill—like language or motor skills—that you are particularly interested in for your child? 🎨📚"
    },
    {
        keywords: ['uniform', 'clothes', 'dress code'],
        answer: "No uniforms here—just comfortable play clothes! We recommend packing a spare set in their bag for those messy, fun moments. Do you have any other questions about what your child should bring to the center? 👕👟"
    },
    {
        keywords: ['potty', 'toilet', 'diaper', 'training'],
        answer: "Potty training is a big milestone, and we're here to help you through it! For the younger ones, we follow a very gentle hygiene schedule. Are you currently in the middle of potty training at home? 🧸🚽"
    },
    {
        keywords: ['*'],
        answer: "I want to make sure I give you exactly the right answer! I can tell you all about our enrollment, fees, daily meals, or even our security system. What would you like to hear more about? Or would you prefer to speak to one of our friendly staff members at +880-1234-56789? 😊"
    }
];

/**
 * Finds a matching answer based on the message content.
 * @param {string} message 
 * @returns {string|null}
 */
const findManualAnswer = (message) => {
    const msg = message.toLowerCase();
    for (const entry of manualQA) {
        if (entry.keywords.includes('*')) continue; // Skip catch-all in first loop
        if (entry.keywords.some(k => msg.includes(k))) {
            return entry.answer;
        }
    }
    // Return catch-all if no matches
    const defaultEntry = manualQA.find(e => e.keywords.includes('*'));
    return defaultEntry ? defaultEntry.answer : null;
};

module.exports = { findManualAnswer };
