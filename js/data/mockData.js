// Mock Data for CampusConnect

const mockColleges = [
    { id: 1, name: "MIT College", subdomain: "mit", logo: "/api/placeholder/50/50" },
    { id: 2, name: "Stanford University", subdomain: "stanford", logo: "/api/placeholder/50/50" },
    { id: 3, name: "IIT Mumbai", subdomain: "iitmumbai", logo: "/api/placeholder/50/50" }
];

const mockCategories = [
    { id: 1, name: "Events", icon: "fas fa-calendar", color: "bg-blue-500" },
    { id: 2, name: "Achievements", icon: "fas fa-trophy", color: "bg-yellow-500" },
    { id: 3, name: "News", icon: "fas fa-newspaper", color: "bg-green-500" },
    { id: 4, name: "Opportunities", icon: "fas fa-briefcase", color: "bg-purple-500" },
    { id: 5, name: "Clubs", icon: "fas fa-users", color: "bg-indigo-500" }
];

// Enhanced Mock Events Data - Only 3 Events
const mockEvents = [
    {
        id: 1,
        title: "Tech Symposium 2024",
        description: "Annual technology conference featuring industry leaders and innovative startups. Learn about latest trends in AI, Cloud Computing, and Cybersecurity.",
        date: "2024-12-15",
        location: "Main Auditorium",
        category: "Academic",
        register: 127,
        college: "MIT College",
        image: "/api/placeholder/400/200"
    },
    {
        id: 2,
        title: "Hackathon 2024",
        description: "48-hour coding marathon with exciting prizes. Build innovative solutions and compete with the best developers.",
        date: "2024-12-20",
        location: "Computer Lab A",
        category: "Workshop",
        register: 89,
        college: "MIT College",
        image: "/api/placeholder/400/200"
    },
    {
        id: 3,
        title: "Cultural Fest 2025",
        description: "Grand cultural celebration with music, dance, drama performances and food stalls from different cultures.",
        date: "2025-01-10",
        location: "Campus Ground",
        category: "Cultural",
        register: 245,
        college: "MIT College",
        image: "/api/placeholder/400/200"
    }
];

const mockAchievements = [];
// Achievements are now loaded from the database via API

const mockNews = [
    {
        id: 1,
        title: "New Library Wing Opens Next Month",
        content: "The college is excited to announce the opening of our new state-of-the-art library wing...",
        date: "2025-08-05",
        category: "Campus Updates",
        author: "Admin"
    },
    {
        id: 2,
        title: "Career Fair 2025 Registration Open",
        content: "Students can now register for the annual career fair featuring 50+ companies...",
        date: "2025-08-03",
        category: "Career Services",
        author: "Career Center"
    }
];

const mockClubs = [
    {
        id: 1,
        name: "Coding Club",
        description: "A community for programming enthusiasts. Learn, code, and compete in hackathons together.",
        category: "Technology",
        members: 45,
        image: "/api/placeholder/400/200"
    },
    {
        id: 2,
        name: "AI Research Group",
        description: "Exploring artificial intelligence and machine learning through projects and research papers.",
        category: "Research",
        members: 30,
        image: "/api/placeholder/400/200"
    },
    {
        id: 3,
        name: "Music Club",
        description: "For music lovers! Learn instruments, participate in jam sessions and perform at events.",
        category: "Cultural",
        members: 52,
        image: "/api/placeholder/400/200"
    }
];

const mockOpportunities = [
    {
        id: 1,
        title: "Software Engineer Intern",
        company: "Google",
        type: "Internship",
        location: "Mountain View, CA",
        deadline: "2024-12-31",
        description: "Summer internship opportunity for CS students. Work on cutting-edge projects with experienced engineers.",
        requirements: ["CS Major", "Python/Java", "Strong problem-solving skills"]
    },
    {
        id: 2,
        title: "Data Scientist - Full Time",
        company: "Microsoft",
        type: "Full-time",
        location: "Redmond, WA",
        deadline: "2025-01-15",
        description: "Full-time position for graduating students interested in data science and machine learning.",
        requirements: ["Data Science/CS Major", "Python, SQL", "ML experience"]
    },
    {
        id: 3,
        title: "Global Hackathon 2025",
        company: "TechCorp",
        type: "Hackathon",
        location: "Virtual",
        deadline: "2025-02-01",
        description: "48-hour coding challenge with $50K in prizes. Build innovative solutions for real-world problems.",
        requirements: ["Any Major", "Programming Skills", "Team of 2-4"]
    }
];