// Home Page Component
const { useState, useEffect } = React;

const HomePage = () => {
    const [currentNews, setCurrentNews] = useState(0);
    
    const newsItems = [
        {
            id: 1,
            type: "achievement",
            title: "🏆 Sarah Johnson wins National Coding Championship",
            description: "Computer Science student secures first place",
            icon: "fas fa-trophy",
            color: "from-yellow-400 to-orange-500"
        },
        {
            id: 2,
            type: "event",
            title: "🎉 Tech Symposium 2025 - 500+ Registrations",
            description: "Biggest tech event of the year approaching",
            icon: "fas fa-calendar",
            color: "from-blue-400 to-purple-500"
        },
        {
            id: 3,
            type: "research",
            title: "🔬 AI Research Paper Published in Nature",
            description: "Dr. Smith's team breakthrough in machine learning",
            icon: "fas fa-flask",
            color: "from-green-400 to-teal-500"
        },
        {
            id: 4,
            type: "achievement",
            title: "🚀 Students Launch Successful Startup",
            description: "EcoTech Solutions raises $100K in seed funding",
            icon: "fas fa-rocket",
            color: "from-purple-400 to-pink-500"
        },
        {
            id: 5,
            type: "sports",
            title: "⚽ Campus Football Team Reaches Finals",
            description: "Undefeated season leads to championship match",
            icon: "fas fa-futbol",
            color: "from-red-400 to-pink-500"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNews((prev) => (prev + 1) % newsItems.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-shine via-white to-blue-50">
            {/* Hero Section with Floating Shapes */}
            <section className="relative gradient-bg text-white py-24 overflow-hidden">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
                    <div className="animate-fade-in">
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                            Connect. Achieve. Grow.
                        </h1>
                        <div className="relative">
                            <p className="text-xl md:text-2xl mb-8 animate-slide-up text-blue-50">
                                The ultimate platform for college students to discover events, showcase achievements, and build meaningful connections.
                            </p>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-gentle opacity-80"></div>
                        </div>
                    </div>
                    
                    {/* CTAs removed - hero simplified */}
                    
                    {/* Floating Icons */}
                    <div className="absolute top-20 left-20 animate-float">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <i className="fas fa-graduation-cap text-2xl text-white"></i>
                        </div>
                    </div>
                    <div className="absolute bottom-20 right-20 animate-float" style={{animationDelay: '2s'}}>
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <i className="fas fa-trophy text-2xl text-white"></i>
                        </div>
                    </div>
                </div>
            </section>

            {/* Animated News Ticker Section */}
            <section className="py-12 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shimmer"></div>
                
                <div className="max-w-7xl mx-auto px-4">
                    <div className="glass-effect rounded-3xl p-8 relative overflow-hidden">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2 animate-glow">
                                🔥 Campus Highlights
                            </h2>
                            <p className="text-blue-100">Stay updated with the latest achievements and activities</p>
                        </div>
                        
                        <div className="news-ticker relative">
                            {newsItems.map((news, index) => (
                                <div
                                    key={news.id}
                                    className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                                        index === currentNews 
                                            ? 'opacity-100 transform translate-y-0' 
                                            : 'opacity-0 transform translate-y-full'
                                    }`}
                                >
                                    <div className={`bg-gradient-to-r ${news.color} p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 max-w-4xl w-full`}>
                                        <div className="flex items-center space-x-4 text-white">
                                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse-slow">
                                                <i className={`${news.icon} text-xl`}></i>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-1">{news.title}</h3>
                                                <p className="text-white text-opacity-90">{news.description}</p>
                                            </div>
                                            <div className="hidden md:flex space-x-2">
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Progress indicators */}
                        <div className="flex justify-center space-x-2 mt-8">
                            {newsItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentNews(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentNews 
                                            ? 'bg-white scale-125' 
                                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-blue-50 opacity-50"></div>
                
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
                            Why Choose CampusConnect?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the future of student engagement with our cutting-edge platform designed for modern campus life.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockCategories.map((category, index) => (
                            <div 
                                key={category.id} 
                                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 animate-slide-up border border-blue-100" 
                                style={{animationDelay: `${index * 0.15}s`}}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color.replace('bg-', 'from-')} to-blue-400 rounded-2xl flex items-center justify-center mb-6 animate-bounce-gentle shadow-lg group-hover:animate-wiggle`}>
                                        <i className={`${category.icon} text-white text-2xl`}></i>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                    
                                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                        {category.name === 'Events' && 'Discover and participate in exciting campus events and activities with real-time updates and seamless registration.'}
                                        {category.name === 'Achievements' && 'Showcase your accomplishments and get recognized by peers with our interactive achievement system.'}
                                        {category.name === 'News' && 'Stay updated with the latest campus news and announcements through our intelligent news feed.'}
                                        {category.name === 'Opportunities' && 'Find internships, hackathons, and career opportunities tailored to your interests and skills.'}
                                        {category.name === 'Clubs' && 'Apply to clubs and societies that match your interests and build lasting connections.'}
                                        {category.name === 'Clubs' && 'Join clubs and societies that match your interests and build lasting connections.'}
                                    </p>
                                    
                                    <div className="mt-6">
                                        <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 flex items-center group-hover:translate-x-2 transform transition-transform">
                                            Explore {category.name}
                                            <i className="fas fa-arrow-right ml-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Stats Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-float"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-12 animate-fade-in">
                        Join Thousands of Students Worldwide
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: '5000+', label: 'Active Students', icon: 'fas fa-users', delay: '0s' },
                            { number: '250+', label: 'Events Monthly', icon: 'fas fa-calendar', delay: '0.2s' },
                            { number: '100+', label: 'Active Clubs', icon: 'fas fa-users-cog', delay: '0.4s' },
                            { number: '500+', label: 'Opportunities', icon: 'fas fa-briefcase', delay: '0.6s' }
                        ].map((stat, index) => (
                            <div key={index} className="animate-bounce-gentle" style={{animationDelay: stat.delay}}>
                                <div className="bg-white bg-opacity-20 rounded-3xl p-8 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105">
                                    <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                                        <i className={`${stat.icon} text-white text-xl`}></i>
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2 animate-pulse-slow">{stat.number}</div>
                                    <div className="text-blue-100 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};