// Authentication Page Component
const { useState, useContext } = React;

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    // loginType: 'student' or 'admin'
    const [loginType, setLoginType] = useState('student');
    const { setIsAuthenticated, setUser, setCurrentPage } = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        studentId: '',
        adminId: '',
        adminCode: '',
        college: '',
        year: '',
        department: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: loginType,
                    studentId: loginType === 'student' ? formData.studentId : null,
                    adminId: loginType === 'admin' ? formData.adminId : null,
                    college: formData.college || null,
                    year: formData.year || null,
                    department: formData.department || null
                };

            console.log('📤 Sending registration payload:', payload);

            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('📥 Server response:', data);

            if (!response.ok) {
                setError(data.error || 'Authentication failed');
                setLoading(false);
                return;
            }

            if (data.success && data.user) {
                console.log('🎉 Authentication successful! User data:', data.user);
                
                // Save to localStorage FIRST
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log('💾 User saved to localStorage:', localStorage.getItem('user'));
                
                // Then update state
                setUser(data.user);
                setIsAuthenticated(true);
                
                // If this was a registration (not login), show success message
                if (!isLogin) {
                    setSuccess('Your registration is successful! Redirecting...');
                    setTimeout(() => {
                        setCurrentPage(data.user.role === 'admin' ? 'admin' : 'dashboard');
                    }, 1500);
                } else {
                    // Immediate redirect for login
                    setCurrentPage(data.user.role === 'admin' ? 'admin' : 'dashboard');
                }
            } else {
                // If response is ok but no user data, show error
                setError('Registration completed but user data not received. Please login.');
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-blue-500 to-secondary flex items-center justify-center py-12 px-4 relative overflow-hidden">
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-blue-100 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                        <i className="fas fa-graduation-cap text-white text-3xl"></i>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {isLogin ? 'Welcome Back' : 'Join CampusConnect'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {isLogin ? 'Sign in to your account' : 'Create your student account'}
                    </p>

                    {/* Student / Admin Toggle with sliding indicator for smooth transition */}
                    <div className="mt-4 flex items-center justify-center">
                        <div className="relative bg-white rounded-full p-1 shadow-sm" style={{width: 260}}>
                            {/* sliding background */}
                            <div
                                className="absolute top-1 h-9 bg-primary rounded-full transition-all duration-300"
                                style={{
                                    left: loginType === 'student' ? 4 : '50%',
                                    width: '48%'
                                }}
                            />

                            <div className="relative z-10 flex">
                                <button
                                    type="button"
                                    onClick={() => setLoginType('student')}
                                    className={`px-6 py-2 rounded-full transition-transform duration-200 ${loginType === 'student' ? 'text-white' : 'text-gray-700'}`}>
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginType('admin')}
                                    className={`px-6 py-2 rounded-full transition-transform duration-200 ${loginType === 'admin' ? 'text-white' : 'text-gray-700'}`}>
                                    Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Registration Blocked Message */}
                {!isLogin && loginType === 'admin' && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
                        <div className="flex items-start">
                            <i className="fas fa-shield-alt text-yellow-600 text-2xl mr-3 mt-1"></i>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Admin Account Creation Restricted</h3>
                                <p className="text-sm text-gray-700">
                                    Admin accounts can only be created by existing administrators through the Admin Panel or by database administrators. 
                                    Please contact your system administrator if you need admin access.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setLoginType('student')}
                                    className="mt-3 text-sm text-primary hover:text-blue-700 font-semibold"
                                >
                                    ← Switch to Student Registration
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    <div className="space-y-6">
                        {/* Registration-only fields */}
                        {!isLogin && loginType === 'student' && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary transition-all duration-300"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.studentId}
                                        onChange={e => setFormData({...formData, studentId: e.target.value})}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary transition-all duration-300"
                                        placeholder="STU123456"
                                    />
                                </div>
                            </>
                        )}

                        {/* Student ID field for sign-in */}
                        {isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{loginType === 'admin' ? 'Admin ID' : 'Student ID'} (Optional)</label>
                                <input
                                    type="text"
                                    value={loginType === 'admin' ? formData.adminId : formData.studentId}
                                    onChange={e => setFormData({...formData, [loginType === 'admin' ? 'adminId' : 'studentId']: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary transition-all duration-300"
                                    placeholder={loginType === 'admin' ? 'ADM123456' : 'STU123456'}
                                />
                            </div>
                        )}

                        {/* Only show email/password fields when NOT in admin registration mode */}
                        {!(loginType === 'admin' && !isLogin) && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary transition-all duration-300"
                                        placeholder="your.email@college.edu"
                                    />
                                </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary transition-all duration-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mt-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mt-4 flex items-center">
                            <i className="fas fa-check-circle mr-2"></i>
                            {success}
                        </div>
                    )}

                    {/* Only show submit button when NOT in admin registration mode */}
                    {!(loginType === 'admin' && !isLogin) && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    )}
                </form>

                {/* Removed social login buttons: only email/password auth supported now */}

                <p className="mt-8 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 text-primary hover:text-blue-700 font-semibold"
                    >
                        {isLogin ? 'Create Account' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};