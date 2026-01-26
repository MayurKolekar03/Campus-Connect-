// Navigation Component
const { useContext } = React;

const Navbar = () => {
    const { currentPage, setCurrentPage, isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AppContext);

    // Debug logging
    console.log('🧭 Navbar render - isAuthenticated:', isAuthenticated, 'user:', user);

    const handleLogout = () => {
        // clear auth state
        setIsAuthenticated(false);
        setUser(null);
        setCurrentPage('home');
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('currentPage');
    };

    // Public nav (visible to unauthenticated visitors)
    const publicNav = [
        { id: 'home', label: 'Home', icon: 'fas fa-home' },
        { id: 'events', label: 'Events', icon: 'fas fa-calendar' },
        { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' },
        { id: 'clubs', label: 'Clubs', icon: 'fas fa-users' }
    ];

    // Additional items available only to authenticated users
    let privateNav = [
        { id: 'news', label: 'News', icon: 'fas fa-newspaper' },
        { id: 'opportunities', label: 'Opportunities', icon: 'fas fa-briefcase' },
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' }
    ];

    // If the logged-in user is an admin, remove the 'dashboard' item and show 'admin' instead
    const adminNav = { id: 'admin', label: 'Admin', icon: 'fas fa-cog' };
    if (user && user.role === 'admin') {
        privateNav = privateNav.filter(item => item.id !== 'dashboard');
    }

    let navItems = publicNav;
    if (isAuthenticated) {
        navItems = [...publicNav, ...privateNav];
        if (user && user.role === 'admin') {
            navItems = [...navItems, adminNav];
        }
    }

    return (
        <nav className="bg-white shadow-2xl sticky top-0 z-50 border-b-2 border-blue-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center group cursor-pointer" onClick={() => setCurrentPage('home')}>
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                                <i className="fas fa-graduation-cap text-white text-xl animate-bounce-gentle"></i>
                            </div>
                            <div className="ml-4">
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    CampusConnect
                                </span>
                                <div className="text-xs text-gray-500 font-medium">Student Platform</div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex space-x-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                    currentPage === item.id 
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-primary hover:bg-blue-50'
                                }`}
                            >
                                <i className={`${item.icon} transition-all duration-300 ${currentPage === item.id ? 'animate-bounce-gentle' : 'group-hover:animate-wiggle'}`}></i>
                                <span className="font-medium">{item.label}</span>
                                {currentPage === item.id && (
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse-slow"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {/* Dashboard is available in the main nav for authenticated users */}

                                {/* Logout button for both students and admins */}
                                <button
                                    onClick={handleLogout}
                                    className="group bg-white text-primary px-4 py-2 rounded-xl font-semibold border border-blue-100 hover:shadow transition-all duration-200"
                                >
                                    <i className="fas fa-sign-out-alt mr-2"></i>
                                    Logout
                                </button>

                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer animate-glow">
                                        <div className="w-full h-full rounded-full bg-gray-300"></div>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse-slow"></div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setCurrentPage('auth')}
                                className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    <i className="fas fa-sign-in-alt mr-2 group-hover:animate-wiggle"></i>
                                    Login
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};