// AppContext.js - Global State Management
const { useState, useEffect, useContext, createContext } = React;

// Global State Context
const AppContext = createContext();

// Global State Provider
const AppProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        console.log('🔍 Initial load - savedUser from localStorage:', savedUser);
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                console.log('✅ Parsed user:', parsed);
                return parsed;
            } catch (error) {
                console.error('❌ Error parsing saved user:', error);
                localStorage.removeItem('user');
                return null;
            }
        }
        console.log('⚠️ No saved user found');
        return null;
    });
    
    const [currentCollege, setCurrentCollege] = useState(mockColleges[0]);
    
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('currentPage');
        console.log('🔍 Initial load - savedPage:', savedPage);
        return savedPage || 'home';
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const savedUser = localStorage.getItem('user');
        const isAuth = !!savedUser;
        console.log('🔍 Initial load - isAuthenticated:', isAuth);
        return isAuth;
    });
    
    // simple notifier to tell components mock data changed
    const [dataUpdatedAt, setDataUpdatedAt] = useState(Date.now());

    // Track if this is the initial mount
    const [isInitialMount, setIsInitialMount] = useState(true);

    // Mark initial mount as complete after first render
    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    // Save user to localStorage whenever it changes (but not on initial mount)
    useEffect(() => {
        if (isInitialMount) {
            console.log('⏭️ Skipping initial mount - user already loaded from localStorage');
            return;
        }
        
        console.log('💾 User changed:', user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            setIsAuthenticated(true);
            console.log('✅ User saved to localStorage');
        } else {
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            console.log('🗑️ User removed from localStorage');
        }
    }, [user, isInitialMount]);

    // Save current page to localStorage whenever it changes
    useEffect(() => {
        console.log('💾 Page changed to:', currentPage);
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    // Helper functions to mutate mock data (frontend-only). These update the mock arrays
    // in `js/data/mockData.js` and then bump `dataUpdatedAt` so pages can re-sync.
    const notifyDataChange = () => setDataUpdatedAt(Date.now());

    const addEvent = (event) => {
        // create simple id if not provided
        const id = event.id || (mockEvents.length ? Math.max(...mockEvents.map(e => e.id)) + 1 : 1);
        mockEvents.push({ id, ...event });
        notifyDataChange();
        return id;
    };

    const addNews = (news) => {
        const id = news.id || (mockNews.length ? Math.max(...mockNews.map(n => n.id)) + 1 : 1);
        mockNews.unshift({ id, ...news });
        notifyDataChange();
        return id;
    };

    const addOpportunity = (opp) => {
        const hasGlobal = (typeof window !== 'undefined') && Array.isArray(window.mockOpportunities) && window.mockOpportunities.length;
        const id = opp.id || (hasGlobal ? Math.max(...window.mockOpportunities.map(o=>o.id)) + 1 : 1);
        if (typeof window !== 'undefined' && !Array.isArray(window.mockOpportunities)) {
            window.mockOpportunities = [];
        }
        window.mockOpportunities.unshift({ id, ...opp });
        notifyDataChange();
        return id;
    };

    const addClub = (club) => {
        const hasGlobal = (typeof window !== 'undefined') && Array.isArray(window.mockClubs) && window.mockClubs.length;
        const id = club.id || (hasGlobal ? Math.max(...window.mockClubs.map(c=>c.id)) + 1 : 1);
        if (typeof window !== 'undefined' && !Array.isArray(window.mockClubs)) window.mockClubs = [];
        window.mockClubs.push({ id, ...club });
        notifyDataChange();
        return id;
    };

    const addAchievement = (ach) => {
        const id = ach.id || (mockAchievements.length ? Math.max(...mockAchievements.map(a=>a.id)) + 1 : 1);
        mockAchievements.unshift({ id, ...ach });
        notifyDataChange();
        return id;
    };

    const value = {
        user,
        setUser,
        currentCollege,
        setCurrentCollege,
        currentPage,
        setCurrentPage,
        isAuthenticated,
        setIsAuthenticated,
        dataUpdatedAt,
        notifyDataChange,
        addEvent,
        addNews,
        addOpportunity,
        addClub,
        addAchievement
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};