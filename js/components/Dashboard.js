// Dashboard Component
const { useState, useEffect, useContext } = React;

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, setUser } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);

    // Controlled edit form state
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        studentId: user?.studentId || '',
        studentId: user?.studentId || '',
        college: user?.college || '',
        year: user?.year || '',
        department: user?.department || '',
        skills: user?.skills ? (Array.isArray(user.skills) ? user.skills.join(', ') : user.skills) : ''
    });

    // User events and saved opportunities state
    const [userEvents, setUserEvents] = useState([]);
    const [savedOpportunities, setSavedOpportunities] = useState([]);

    useEffect(() => {
        // keep local form in sync if user changes externally
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                studentId: user.studentId || '',
                studentId: user.studentId || '',
                college: user.college || '',
                year: user.year || '',
                department: user.department || '',
                skills: user.skills ? (Array.isArray(user.skills) ? user.skills.join(', ') : user.skills) : ''
            });
        }
    }, [user]);

    // Fetch user's event registrations
    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:4000/api/my-event-registrations?userId=${user.id}`)
                .then(res => res.json())
                .then(data => setUserEvents(data))
                .catch(err => console.error('Error fetching user events:', err));
        }
    }, [user]);

    // Fetch user's saved opportunities
    useEffect(() => {
        if (user && user.id) {
            fetchSavedOpportunities();
        }
    }, [user]);

    const fetchSavedOpportunities = () => {
        if (user && user.id) {
            fetch(`http://localhost:4000/api/my-saved-opportunities?userId=${user.id}`)
                .then(res => res.json())
                .then(data => setSavedOpportunities(data))
                .catch(err => console.error('Error fetching saved opportunities:', err));
        }
    };

    const handleRemoveSavedOpportunity = async (opportunityId) => {
        if (!user || !user.id) return;
        
        try {
            await fetch('http://localhost:4000/api/saved-opportunities', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opportunityId, userId: user.id })
            });
            
            // Update UI immediately
            setSavedOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
            alert('Opportunity removed from saved list');
        } catch (error) {
            console.error('Error removing saved opportunity:', error);
            alert('Error removing opportunity');
        }
    };

    // Build sidebar items. If the logged-in user is a student, hide the 'My Achievements' item.
    const sidebarItems = [
        { id: 'profile', label: 'My Profile', icon: 'fas fa-user' },
        // include achievements only for non-students (e.g., admins or staff)
        ...(user && user.role !== 'student' ? [{ id: 'achievements', label: 'My Achievements', icon: 'fas fa-trophy' }] : []),
        { id: 'events', label: 'My Events', icon: 'fas fa-calendar' },
        { id: 'opportunities', label: 'Saved Opportunities', icon: 'fas fa-briefcase' },
        { id: 'clubs', label: 'My Clubs', icon: 'fas fa-users' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-shine">
            <div className="flex">
                {/* Enhanced Sidebar */}
                <div className="w-64 bg-white shadow-2xl min-h-screen border-r-2 border-blue-100">
                    <div className="p-6 border-b border-blue-100">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dashboard</h2>
                        <p className="text-gray-500 text-sm">Student Portal</p>
                    </div>
                    <nav className="mt-6">
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-all duration-300 transform hover:scale-105 ${
                                    activeTab === item.id 
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg border-r-4 border-blue-700' 
                                        : 'text-gray-600 hover:text-primary hover:bg-blue-50'
                                }`}
                            >
                                <i className={`${item.icon} ${activeTab === item.id ? 'animate-bounce-gentle' : ''}`}></i>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {activeTab === 'profile' && (
                        <div className="animate-fade-in">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">My Profile</h1>
                            <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
                                <div className="flex items-center space-x-6 mb-8">
                                        <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg animate-glow flex items-center justify-center">
                                            <i className="fas fa-user text-white text-2xl"></i>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{form.name || 'User'}</h2>
                                            {form.department && form.year && (
                                                <p className="text-gray-600">{form.department} • Class of {form.year}</p>
                                            )}
                                            <p className="text-gray-500">{form.email}</p>
                                            {form.studentId && <p className="text-gray-500 text-sm">Student ID: {form.studentId}</p>}
                                            {form.contact && <p className="text-gray-500 text-sm">Contact: {form.contact}</p>}
                                        </div>
                                    </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Skills</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {form.skills ? (
                                                form.skills.split(',').map((skill, idx) => (
                                                    <span key={idx} className="bg-gradient-to-r from-blue-100 to-blue-200 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                                                        {skill.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 italic">No skills added yet. Click "Edit Profile" to add your skills.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <button onClick={() => setIsEditing(true)} className="mt-8 bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    Edit Profile
                                </button>
                                {/* Edit Modal */}
                                {isEditing && (
                                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold">Edit Profile</h3>
                                                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-800">Close</button>
                                            </div>

                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                
                                                try {
                                                    // Save to database
                                                    const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
                                                        method: 'PUT',
                                                        headers: { 
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            name: form.name,
                                                            studentId: form.studentId,
                                                            contact: form.contact,
                                                            college: form.college,
                                                            year: form.year,
                                                            department: form.department,
                                                            skills: form.skills
                                                        })
                                                    });

                                                    if (response.ok) {
                                                        // update AppContext user
                                                        const updated = {
                                                            ...(user || {}),
                                                            name: form.name,
                                                            email: form.email,
                                                            studentId: form.studentId,
                                                            contact: form.contact,
                                                            college: form.college,
                                                            year: form.year,
                                                            department: form.department,
                                                            skills: form.skills
                                                        };
                                                        setUser(updated);
                                                        localStorage.setItem('user', JSON.stringify(updated));
                                                        setIsEditing(false);
                                                        alert('Profile updated successfully!');
                                                    } else {
                                                        alert('Failed to update profile');
                                                    }
                                                } catch (error) {
                                                    console.error('Error updating profile:', error);
                                                    alert('Error updating profile');
                                                }
                                            }}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
                                                        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                        <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                                                        <input value={form.studentId} onChange={(e) => setForm({...form, studentId: e.target.value})} placeholder="e.g., STU123456" className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                                        <input value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} placeholder="e.g., +1 234-567-8900" className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">College</label>
                                                        <input value={form.college} onChange={(e) => setForm({...form, college: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                                                        <input value={form.year} onChange={(e) => setForm({...form, year: e.target.value})} placeholder="e.g., 3rd Year" className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                                        <input value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma separated)</label>
                                                        <input value={form.skills} onChange={(e) => setForm({...form, skills: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-end space-x-3">
                                                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg border">Cancel</button>
                                                    <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white">Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="animate-fade-in">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">My Events</h1>
                            <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
                                {userEvents.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="mb-4">
                                            <i className="fas fa-calendar-times text-6xl text-gray-300"></i>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-500 mb-2">No registered events yet</h3>
                                        <p className="text-gray-400 mb-6">You haven't registered for any events. Browse events and register to see them here!</p>
                                        <button 
                                            onClick={() => window.location.href = '/#/events'}
                                            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            <i className="fas fa-calendar mr-2"></i>
                                            Browse Events
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {userEvents.map((registration, index) => (
                                            <div key={registration.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-3">
                                                            <h3 className="text-xl font-bold text-gray-800">{registration.event_title}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {registration.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 mb-4 leading-relaxed">{registration.event_description}</p>
                                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <i className="fas fa-calendar mr-2 text-blue-400"></i>
                                                                <span>{new Date(registration.event_date).toLocaleDateString('en-US', { 
                                                                    weekday: 'long', 
                                                                    year: 'numeric', 
                                                                    month: 'short', 
                                                                    day: 'numeric' 
                                                                })}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <i className="fas fa-map-marker-alt mr-2 text-red-400"></i>
                                                                <span>{registration.event_location}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <i className="fas fa-tag mr-2 text-purple-400"></i>
                                                                <span>{registration.event_category}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 text-sm text-gray-500">
                                                            <i className="fas fa-clock mr-2"></i>
                                                            Registered on {new Date(registration.registered_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'opportunities' && (
                        <div className="animate-fade-in">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">Saved Opportunities</h1>
                            <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
                                {savedOpportunities.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="mb-4">
                                            <i className="fas fa-briefcase text-6xl text-gray-300"></i>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-500 mb-2">No saved opportunities yet</h3>
                                        <p className="text-gray-400 mb-6">You haven't saved any opportunities. Browse opportunities and save them to see here!</p>
                                        <button 
                                            onClick={() => window.location.href = '/#/opportunities'}
                                            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            <i className="fas fa-briefcase mr-2"></i>
                                            Browse Opportunities
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {savedOpportunities.map((opportunity, index) => (
                                            <div key={opportunity.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-3">
                                                            <h3 className="text-xl font-bold text-gray-800">{opportunity.title}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                opportunity.type === 'Internship' ? 'bg-blue-100 text-blue-800' :
                                                                opportunity.type === 'Hackathon' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                                {opportunity.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 mb-2 font-medium">{opportunity.company}</p>
                                                        <p className="text-gray-600 mb-4 leading-relaxed">{opportunity.description}</p>
                                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <i className="fas fa-map-marker-alt mr-2 text-red-400"></i>
                                                                <span>{opportunity.location}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <i className="fas fa-clock mr-2 text-yellow-400"></i>
                                                                <span>Due: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex flex-col space-y-2">
                                                        <button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                                            Apply Now
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRemoveSavedOpportunity(opportunity.id)}
                                                            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                                                        >
                                                            <i className="fas fa-trash mr-2"></i>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Other dashboard tabs would go here... */}
                </div>
            </div>
        </div>
    );
};