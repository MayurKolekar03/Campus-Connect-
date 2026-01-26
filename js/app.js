// Main App Component
const { useContext } = React;

const App = () => {
    const { currentPage, isAuthenticated, user } = useContext(AppContext);
    
    // Debug logging on every render
    console.log('🔄 App render - isAuthenticated:', isAuthenticated, 'user:', user, 'currentPage:', currentPage);

    const renderPage = () => {
        switch(currentPage) {
            case 'home':
                return <HomePage />;
            case 'events':
                return <EventsPage />;
            case 'achievements':
                return <AchievementsPage />;
            case 'news':
                return isAuthenticated ? <NewsPage /> : <AuthPage />;
            case 'opportunities':
                return isAuthenticated ? <OpportunitiesPage /> : <AuthPage />;
            case 'clubs':
                return <ClubsPage />;
            case 'auth':
                return <AuthPage />;
            case 'dashboard':
                return isAuthenticated ? <Dashboard /> : <AuthPage />;
            case 'admin':
                return isAuthenticated ? <AdminPanel /> : <AuthPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {renderPage()}
            
            {/* Enhanced Footer */}
            <footer className="bg-gradient-to-r from-primary via-blue-600 to-secondary text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="animate-fade-in">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center animate-bounce-gentle">
                                    <i className="fas fa-graduation-cap text-white text-xl"></i>
                                </div>
                                <span className="ml-3 text-2xl font-bold">CampusConnect</span>
                            </div>
                            <p className="text-blue-100 leading-relaxed">
                                Connecting students, fostering achievements, and building stronger campus communities.
                            </p>
                        </div>
                        
                        <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                            <h3 className="font-bold mb-6 text-lg">Platform</h3>
                            <ul className="space-y-3 text-blue-100">
                                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                                    <i className="fas fa-calendar mr-2 group-hover:animate-wiggle"></i>Events
                                </a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                                    <i className="fas fa-trophy mr-2 group-hover:animate-wiggle"></i>Achievements
                                </a></li>
                                
                                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                                    <i className="fas fa-users mr-2 group-hover:animate-wiggle"></i>Clubs
                                </a></li>
                            </ul>
                        </div>
                        
                        <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                            <h3 className="font-bold mb-6 text-lg">Support</h3>
                            <ul className="space-y-3 text-blue-100">
                                <li><a href="#" className="hover:text-white transition-colors duration-300">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
                            </ul>
                        </div>
                        
                        <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                            <h3 className="font-bold mb-6 text-lg">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-blue-100 hover:text-white hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110 hover:animate-bounce-gentle">
                                    <i className="fab fa-twitter text-lg"></i>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-blue-100 hover:text-white hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110 hover:animate-bounce-gentle">
                                    <i className="fab fa-facebook text-lg"></i>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-blue-100 hover:text-white hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110 hover:animate-bounce-gentle">
                                    <i className="fab fa-instagram text-lg"></i>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-blue-100 hover:text-white hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110 hover:animate-bounce-gentle">
                                    <i className="fab fa-linkedin text-lg"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-blue-400 border-opacity-30 mt-12 pt-8 text-center text-blue-100 animate-fade-in">
                        <p>&copy; 2025 CampusConnect. All rights reserved. | Built for the future of student engagement.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Root Component with Context
const Root = () => {
    return (
        <AppProvider>
            <App />
        </AppProvider>
    );
};

// Initialize the application
ReactDOM.render(<Root />, document.getElementById('root'));