// AdminPanel.js - Complete admin dashboard with user activity tracking
const { useState, useEffect, useContext } = React;
const API_BASE = 'http://localhost:4000';

const AdminPanel = () => {
    const { user, isAuthenticated } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('activity');
    const [eventRegistrations, setEventRegistrations] = useState([]);
    const [clubApplications, setClubApplications] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!isAuthenticated || !user || user.role !== 'admin') {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-semibold">Access denied</h2>
                <p className="text-gray-600">You must be an admin to view this section.</p>
            </div>
        );
    }

    // Fetch user activity data
    useEffect(() => {
        if (activeTab === 'activity') {
            fetchUserActivity();
        }
    }, [activeTab]);

    const fetchUserActivity = async () => {
        setLoading(true);
        try {
            const headers = {
                'x-user-role': user.role,
                'x-user-id': user.id || '1'
            };

            const [regsRes, appsRes, achsRes] = await Promise.all([
                fetch(`${API_BASE}/api/admin/event-registrations`, { headers }),
                fetch(`${API_BASE}/api/admin/club-applications`, { headers }),
                fetch(`${API_BASE}/api/admin/achievements`, { headers })
            ]);

            setEventRegistrations(await regsRes.json());
            setClubApplications(await appsRes.json());
            setAchievements(await achsRes.json());
        } catch (error) {
            console.error('Failed to fetch user activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveClubApp = async (id) => {
        try {
            await fetch(`${API_BASE}/api/admin/club-applications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify({ status: 'approved' })
            });
            fetchUserActivity();
        } catch (error) {
            console.error('Failed to approve application:', error);
        }
    };

    const handleRejectClubApp = async (id) => {
        try {
            await fetch(`${API_BASE}/api/admin/club-applications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify({ status: 'rejected' })
            });
            fetchUserActivity();
        } catch (error) {
            console.error('Failed to reject application:', error);
        }
    };

    const handleApproveAchievement = async (id) => {
        try {
            await fetch(`${API_BASE}/api/admin/achievements/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify({ status: 'approved' })
            });
            fetchUserActivity();
        } catch (error) {
            console.error('Failed to approve achievement:', error);
        }
    };

    const handleRejectAchievement = async (id) => {
        try {
            await fetch(`${API_BASE}/api/admin/achievements/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify({ status: 'rejected' })
            });
            fetchUserActivity();
        } catch (error) {
            console.error('Failed to reject achievement:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`px-6 py-3 font-medium ${activeTab === 'activity' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
                        >
                            User Activity
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-6 py-3 font-medium ${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
                        >
                            Manage Content
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`px-6 py-3 font-medium ${activeTab === 'search' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
                        >
                            <i className="fas fa-search mr-2"></i>Search
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'activity' && (
                    <ActivityTab
                        loading={loading}
                        user={user}
                        eventRegistrations={eventRegistrations}
                        setEventRegistrations={setEventRegistrations}
                        clubApplications={clubApplications}
                        achievements={achievements}
                        onApproveClubApp={handleApproveClubApp}
                        onRejectClubApp={handleRejectClubApp}
                        onApproveAchievement={handleApproveAchievement}
                        onRejectAchievement={handleRejectAchievement}
                    />
                )}
                {activeTab === 'content' && <ContentTab user={user} />}
                {activeTab === 'search' && <UnifiedSearchTab user={user} />}
            </div>
        </div>
    );
};

// Activity Tab - Shows all user activity
function ActivityTab({ loading, user, eventRegistrations, setEventRegistrations, clubApplications, achievements, onApproveClubApp, onRejectClubApp, onApproveAchievement, onRejectAchievement }) {
    if (loading) {
        return <div className="text-center py-8">Loading user activity...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Event Registrations */}
            <div className="space-y-6">
                {/* Approved Registrations - Logged In Users Only */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-green-700">✅ Registered Users (Logged In - Auto Approved)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Event</th>
                                    <th className="px-4 py-2 text-left">Student Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Contact</th>
                                    <th className="px-4 py-2 text-left">College</th>
                                    <th className="px-4 py-2 text-left">Year/Dept</th>
                                    <th className="px-4 py-2 text-left">Student ID</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventRegistrations.filter(reg => reg.user_id !== null && reg.status === 'approved').length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-4 text-gray-500">No logged-in user registrations yet</td></tr>
                                ) : (
                                    eventRegistrations.filter(reg => reg.user_id !== null && reg.status === 'approved').map((reg) => (
                                        <tr key={reg.id} className="border-t hover:bg-green-50">
                                            <td className="px-4 py-3">{reg.event_title}</td>
                                            <td className="px-4 py-3">{reg.full_name}</td>
                                            <td className="px-4 py-3">{reg.email}</td>
                                            <td className="px-4 py-3">{reg.contact}</td>
                                            <td className="px-4 py-3">{reg.college_name}</td>
                                            <td className="px-4 py-3">{reg.year} - {reg.department}</td>
                                            <td className="px-4 py-3">{reg.student_id || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{new Date(reg.registered_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending Registrations - Guest Users Only - Needs Approval */}
                <div className="bg-white p-6 rounded-lg shadow border-2 border-yellow-200">
                    <h2 className="text-xl font-semibold mb-4 text-yellow-700">⏳ Pending Approvals (Guest Users - Not Logged In)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-yellow-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Event</th>
                                    <th className="px-4 py-2 text-left">Student Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Contact</th>
                                    <th className="px-4 py-2 text-left">College</th>
                                    <th className="px-4 py-2 text-left">Year/Dept</th>
                                    <th className="px-4 py-2 text-left">Student ID</th>
                                    <th className="px-4 py-2 text-left">College ID</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventRegistrations.filter(reg => reg.user_id === null && reg.status === 'pending').length === 0 ? (
                                    <tr><td colSpan="9" className="text-center py-4 text-gray-500">No pending guest registrations</td></tr>
                                ) : (
                                    eventRegistrations.filter(reg => reg.user_id === null && reg.status === 'pending').map((reg) => (
                                        <tr key={reg.id} className="border-t hover:bg-yellow-50">
                                            <td className="px-4 py-3">{reg.event_title}</td>
                                            <td className="px-4 py-3 font-medium">{reg.full_name}</td>
                                            <td className="px-4 py-3">{reg.email}</td>
                                            <td className="px-4 py-3">{reg.contact}</td>
                                            <td className="px-4 py-3">{reg.college_name}</td>
                                            <td className="px-4 py-3">{reg.year} - {reg.department}</td>
                                            <td className="px-4 py-3">{reg.student_id || '-'}</td>
                                            <td className="px-4 py-3">
                                                {reg.college_id_image ? (
                                                    <a href={reg.college_id_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        <i className="fas fa-image"></i> View ID
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const response = await fetch(`${API_BASE}/api/admin/event-registrations/${reg.id}`, {
                                                                    method: 'PATCH',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'x-user-role': user?.role || 'admin',
                                                                        'x-user-id': user?.id || '1'
                                                                    },
                                                                    body: JSON.stringify({ status: 'approved' })
                                                                });
                                                                
                                                                const data = await response.json();
                                                                console.log('Approve response:', response.status, data);
                                                                
                                                                if (response.ok) {
                                                                    alert('✅ Registration approved!');
                                                                    // Update local state
                                                                    setEventRegistrations(eventRegistrations.map(r => 
                                                                        r.id === reg.id ? { ...r, status: 'approved' } : r
                                                                    ));
                                                                } else {
                                                                    alert('Failed to approve: ' + (data.error || 'Unknown error'));
                                                                }
                                                            } catch (error) {
                                                                console.error('Error approving registration:', error);
                                                                alert('Failed to approve registration: ' + error.message);
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                    >
                                                        <i className="fas fa-check"></i> Accept
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm('Are you sure you want to reject this registration?')) return;
                                                            try {
                                                                const response = await fetch(`${API_BASE}/api/admin/event-registrations/${reg.id}`, {
                                                                    method: 'PATCH',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'x-user-role': user?.role || 'admin',
                                                                        'x-user-id': user?.id || '1'
                                                                    },
                                                                    body: JSON.stringify({ status: 'rejected' })
                                                                });
                                                                
                                                                const data = await response.json();
                                                                console.log('Reject response:', response.status, data);
                                                                
                                                                if (response.ok) {
                                                                    alert('❌ Registration rejected');
                                                                    // Update local state
                                                                    setEventRegistrations(eventRegistrations.map(r => 
                                                                        r.id === reg.id ? { ...r, status: 'rejected' } : r
                                                                    ));
                                                                } else {
                                                                    alert('Failed to reject: ' + (data.error || 'Unknown error'));
                                                                }
                                                            } catch (error) {
                                                                console.error('Error rejecting registration:', error);
                                                                alert('Failed to reject registration: ' + error.message);
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                                    >
                                                        <i className="fas fa-times"></i> Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Club Applications */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Club Applications</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Club</th>
                                <th className="px-4 py-2 text-left">Student</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Message</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clubApplications.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4 text-gray-500">No applications yet</td></tr>
                            ) : (
                                clubApplications.map((app) => (
                                    <tr key={app.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{app.club_name}</td>
                                        <td className="px-4 py-3">{app.user_name}</td>
                                        <td className="px-4 py-3">{app.user_email}</td>
                                        <td className="px-4 py-3">{app.message || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {app.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onApproveClubApp(app.id)}
                                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => onRejectClubApp(app.id)}
                                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Achievements Pending Approval */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Achievements (Pending Approval)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Title</th>
                                <th className="px-4 py-2 text-left">Student</th>
                                <th className="px-4 py-2 text-left">Department</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {achievements.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No achievements yet</td></tr>
                            ) : (
                                achievements.map((ach) => (
                                    <tr key={ach.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{ach.title}</td>
                                        <td className="px-4 py-3">{ach.user_name || 'N/A'}</td>
                                        <td className="px-4 py-3">{ach.department || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                ach.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                ach.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {ach.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {ach.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onApproveAchievement(ach.id)}
                                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => onRejectAchievement(ach.id)}
                                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Content Tab - Manage all content
function ContentTab({ user }) {
    return (
        <div className="bg-white rounded-lg p-6 shadow space-y-10">
            <section>
                <h2 className="text-xl font-semibold mb-4">Create / Add Event</h2>
                <AdminCreateEventForm user={user} />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Create / Add News</h2>
                <AdminCreateNewsForm user={user} />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Create / Add Opportunity</h2>
                <AdminCreateOpportunityForm user={user} />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Create / Add Club</h2>
                <AdminCreateClubForm user={user} />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Share College Achievement</h2>
                <AdminCreateAchievementForm user={user} />
            </section>
        </div>
    );
}

// Create Forms with backend integration
function AdminCreateEventForm({ user }) {
    const [form, setForm] = useState({ id: '', title: '', description: '', date: '', location: '', category: '', college: '', image: '' });
    const [status, setStatus] = useState(null);
    const [checkingDuplicate, setCheckingDuplicate] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const checkForDuplicate = async (eventId) => {
        if (!eventId.trim()) return false;
        
        setCheckingDuplicate(true);
        try {
            const headers = {
                'x-user-role': user.role,
                'x-user-id': user.id || '1'
            };
            
            const response = await fetch(`${API_BASE}/api/events`, { headers });
            const events = await response.json();
            
            const duplicate = events.find(event => 
                event.id.toString() === eventId.toString()
            );
            
            return !!duplicate;
        } catch (error) {
            console.error('Error checking for duplicates:', error);
            return false;
        } finally {
            setCheckingDuplicate(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        
        // Check for duplicate event ID
        const isDuplicate = await checkForDuplicate(form.id);
        if (isDuplicate) {
            setStatus({ ok: false, msg: 'An event with this ID already exists! Please choose a different ID.' });
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/api/admin/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setStatus({ ok: true, msg: 'Event created successfully!' });
                // Add to mockEvents
                const responseData = await response.json();
                const newEvent = {
                    id: responseData.id || parseInt(form.id),
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    location: form.location,
                    category: form.category,
                    college: form.college,
                    register: 0
                };
                if (window.mockEvents) {
                    window.mockEvents.push(newEvent);
                }
                setForm({ id: '', title: '', description: '', date: '', location: '', category: '', college: '', image: '' });
                // Trigger update for EventsPage
                window.dispatchEvent(new CustomEvent('eventsUpdated'));
            } else {
                setStatus({ ok: false, msg: 'Failed to create event' });
            }
        } catch (err) {
            setStatus({ ok: false, msg: String(err) });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <input 
                    required 
                    type="number"
                    value={form.id} 
                    onChange={e => setForm({ ...form, id: e.target.value })} 
                    placeholder="Event ID (e.g., 4, 5, 6...)" 
                    className="w-full p-3 border rounded" 
                />
                {checkingDuplicate && <p className="text-sm text-blue-600 mt-1">Checking for duplicate ID...</p>}
            </div>
            <div className="md:col-span-2">
                <input 
                    required 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                    placeholder="Event Title" 
                    className="w-full p-3 border rounded" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                    required
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value })} 
                    className="w-full p-3 border rounded"
                >
                    <option value="">Select Category</option>
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Technical">Technical</option>
                </select>
            </div>
            <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} type="datetime-local" className="p-3 border rounded" />
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" className="p-3 border rounded" />
            <input value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} placeholder="College" className="p-3 border rounded" />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 p-3 border rounded" />
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Event Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="p-3 border rounded w-full" />
                {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded" disabled={checkingDuplicate}>
                    {checkingDuplicate ? 'Checking...' : 'Create Event'}
                </button>
            </div>
            {status && <div className={`md:col-span-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</div>}
        </form>
    );
}

function AdminCreateNewsForm({ user }) {
    const [form, setForm] = useState({ title: '', content: '', category: '' });
    const [status, setStatus] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE}/api/admin/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setStatus({ ok: true, msg: 'News created successfully!' });
                const responseData = await response.json();
                const newNews = {
                    id: responseData.id || Date.now(),
                    title: form.title,
                    content: form.content,
                    category: form.category,
                    author: form.author,
                    date: new Date().toISOString()
                };
                if (window.mockNews) {
                    window.mockNews.push(newNews);
                }
                setForm({ title: '', content: '', category: '' });
                window.dispatchEvent(new CustomEvent('newsUpdated'));
            } else {
                setStatus({ ok: false, msg: 'Failed to create news' });
            }
        } catch (err) {
            setStatus({ ok: false, msg: String(err) });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Headline" className="p-3 border rounded" />
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="p-3 border rounded" />
            <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Author" className="p-3 border rounded" />
            <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Content" className="p-3 border rounded" rows={6} />
            <div className="flex justify-end"><button className="px-6 py-2 bg-primary text-white rounded">Create News</button></div>
            {status && <div className={`${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</div>}
        </form>
    );
}

function AdminCreateOpportunityForm({ user }) {
    const [form, setForm] = useState({ title: '', company: '', type: '', location: '', deadline: '', description: '' });
    const [status, setStatus] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE}/api/admin/opportunities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setStatus({ ok: true, msg: 'Opportunity created successfully!' });
                const responseData = await response.json();
                const newOpp = {
                    id: responseData.id || Date.now(),
                    title: form.title,
                    company: form.company,
                    type: form.type,
                    location: form.location,
                    deadline: form.deadline,
                    description: form.description,
                    requirements: []
                };
                if (window.mockOpportunities) {
                    window.mockOpportunities.push(newOpp);
                }
                setForm({ title: '', company: '', type: '', location: '', deadline: '', description: '' });
                window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
            } else {
                setStatus({ ok: false, msg: 'Failed to create opportunity' });
            }
        } catch (err) {
            setStatus({ ok: false, msg: String(err) });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="p-3 border rounded" />
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company" className="p-3 border rounded" />
            <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Type (Internship/Job)" className="p-3 border rounded" />
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" className="p-3 border rounded" />
            <input value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} type="date" className="p-3 border rounded md:col-span-2" />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 p-3 border rounded" rows={4} />
            <div className="md:col-span-2 flex justify-end"><button className="px-6 py-2 bg-primary text-white rounded">Create Opportunity</button></div>
            {status && <div className={`${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</div>}
        </form>
    );
}

function AdminCreateClubForm({ user }) {
    const [form, setForm] = useState({ name: '', category: '', description: '', image: '' });
    const [status, setStatus] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE}/api/admin/clubs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setStatus({ ok: true, msg: 'Club created successfully!' });
                const responseData = await response.json();
                const newClub = {
                    id: responseData.id || Date.now(),
                    name: form.name,
                    category: form.category,
                    description: form.description,
                    members: 0,
                    image: 'bg-gradient-to-br from-blue-400 to-purple-500'
                };
                if (window.mockClubs) {
                    window.mockClubs.push(newClub);
                }
                setForm({ name: '', category: '', description: '', image: '' });
                // Trigger refresh on ClubsPage
                window.dispatchEvent(new CustomEvent('clubsUpdated'));
            } else {
                setStatus({ ok: false, msg: 'Failed to create club' });
            }
        } catch (err) {
            setStatus({ ok: false, msg: String(err) });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Club name" className="p-3 border rounded" />
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="p-3 border rounded" />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="p-3 border rounded" rows={4} />
            <div>
                <label className="block text-sm font-medium mb-2">Club Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="p-3 border rounded w-full" />
                {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
            </div>
            <div className="flex justify-end"><button className="px-6 py-2 bg-primary text-white rounded">Create Club</button></div>
            {status && <div className={`${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</div>}
        </form>
    );
}

// Unified Search Tab - Search across all content types
function UnifiedSearchTab({ user }) {
    const [category, setCategory] = useState('events');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Category configuration
    const categoryConfig = {
        events: {
            label: 'Events',
            icon: 'fa-calendar',
            apiEndpoint: '/api/events',
            adminEndpoint: '/api/admin/events',
            searchFields: ['title', 'id', 'category', 'location', 'college'],
            color: 'blue'
        },
        news: {
            label: 'News',
            icon: 'fa-newspaper',
            apiEndpoint: '/api/news',
            adminEndpoint: '/api/admin/news',
            searchFields: ['title', 'id', 'category'],
            color: 'green'
        },
        opportunities: {
            label: 'Opportunities',
            icon: 'fa-briefcase',
            apiEndpoint: '/api/opportunities',
            adminEndpoint: '/api/admin/opportunities',
            searchFields: ['title', 'id', 'company', 'type', 'location'],
            color: 'purple'
        },
        clubs: {
            label: 'Clubs',
            icon: 'fa-users',
            apiEndpoint: '/api/clubs',
            adminEndpoint: '/api/admin/clubs',
            searchFields: ['name', 'id', 'category'],
            color: 'indigo'
        },
        achievements: {
            label: 'Achievements',
            icon: 'fa-trophy',
            apiEndpoint: '/api/achievements',
            adminEndpoint: '/api/admin/achievements',
            searchFields: ['title', 'id'],
            color: 'yellow'
        }
    };

    useEffect(() => {
        fetchData();
        setSearchBy(categoryConfig[category].searchFields[0]);
        setSearchTerm('');
    }, [category]);

    useEffect(() => {
        filterData();
    }, [searchTerm, searchBy, allData]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = categoryConfig[category];
            const headers = {
                'x-user-role': user.role,
                'x-user-id': user.id || '1'
            };
            const response = await fetch(`${API_BASE}${config.apiEndpoint}`, { headers });
            const data = await response.json();
            setAllData(data);
        } catch (error) {
            console.error(`Failed to fetch ${category}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        if (!searchTerm) {
            setFilteredData(allData);
            return;
        }

        const filtered = allData.filter(item => {
            const searchValue = searchTerm.toLowerCase();
            const fieldValue = item[searchBy]?.toString().toLowerCase() || '';
            return fieldValue.includes(searchValue);
        });
        setFilteredData(filtered);
    };

    const handleDelete = async (id) => {
        if (!confirm(`Are you sure you want to delete this ${category.slice(0, -1)}?`)) return;
        
        try {
            const config = categoryConfig[category];
            const response = await fetch(`${API_BASE}${config.adminEndpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                }
            });
            
            if (response.ok) {
                alert(`${categoryConfig[category].label} deleted successfully!`);
                fetchData();
                // Trigger relevant event
                if (category === 'clubs') window.dispatchEvent(new CustomEvent('clubsUpdated'));
                if (category === 'news') window.dispatchEvent(new CustomEvent('newsUpdated'));
                if (category === 'opportunities') window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
            } else {
                alert(`Failed to delete ${category.slice(0, -1)}`);
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting item');
        }
    };

    const renderDataItem = (item) => {
        const config = categoryConfig[category];
        
        return (
            <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                ID: {item.id}
                            </span>
                            {/* Category-specific badges */}
                            {category === 'events' && item.category && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                    item.category === 'Academic' ? 'bg-purple-100 text-purple-800' :
                                    item.category === 'Cultural' ? 'bg-green-100 text-green-800' :
                                    item.category === 'Sports' ? 'bg-orange-100 text-orange-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {item.category}
                                </span>
                            )}
                            {category === 'news' && item.category && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {item.category}
                                </span>
                            )}
                            {category === 'opportunities' && item.type && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                    item.type === 'Internship' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {item.type}
                                </span>
                            )}
                            {category === 'clubs' && item.category && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    {item.category}
                                </span>
                            )}
                            {category === 'achievements' && item.category && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    {item.category}
                                </span>
                            )}
                        </div>
                        
                        <h4 className="font-semibold text-lg mb-2">
                            {item.title || item.name}
                        </h4>
                        
                        {/* Category-specific details */}
                        {category === 'events' && (
                            <>
                                <p className="text-gray-600 mb-3">{item.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                                    <div><i className="fas fa-calendar mr-1"></i>{item.date ? new Date(item.date).toLocaleDateString() : 'TBD'}</div>
                                    <div><i className="fas fa-map-marker-alt mr-1"></i>{item.location || 'TBD'}</div>
                                    <div><i className="fas fa-university mr-1"></i>{item.college || 'Campus'}</div>
                                    <div><i className="fas fa-users mr-1"></i>{item.register || 0} registered</div>
                                </div>
                            </>
                        )}
                        
                        {category === 'news' && (
                            <>
                                <p className="text-gray-600 mb-3">{item.content}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <div><i className="fas fa-calendar mr-1"></i>{new Date(item.date).toLocaleDateString()}</div>
                                </div>
                            </>
                        )}
                        
                        {category === 'opportunities' && (
                            <>
                                {item.company && <p className="text-gray-700 mb-2"><i className="fas fa-building mr-1"></i>{item.company}</p>}
                                <p className="text-gray-600 mb-3">{item.description}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    {item.location && <div><i className="fas fa-map-marker-alt mr-1"></i>{item.location}</div>}
                                    {item.deadline && <div><i className="fas fa-calendar mr-1"></i>Deadline: {new Date(item.deadline).toLocaleDateString()}</div>}
                                </div>
                            </>
                        )}
                        
                        {category === 'clubs' && (
                            <>
                                <p className="text-gray-600 mb-3">{item.description}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    {item.members && <div><i className="fas fa-users mr-1"></i>{item.members} members</div>}
                                    {item.contact && <div><i className="fas fa-envelope mr-1"></i>{item.contact}</div>}
                                </div>
                            </>
                        )}
                        
                        {category === 'achievements' && (
                            <>
                                {item.studentName && <p className="text-gray-700 mb-2"><i className="fas fa-user mr-1"></i>{item.studentName}</p>}
                                <p className="text-gray-600 mb-3">{item.description}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <div><i className="fas fa-calendar mr-1"></i>{new Date(item.date).toLocaleDateString()}</div>
                                    <div><i className="fas fa-thumbs-up mr-1"></i>{item.upvotes || 0} upvotes</div>
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                            <i className="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center py-8">Loading {categoryConfig[category].label.toLowerCase()}...</div>;

    return (
        <div className="space-y-6">
            
            {/* Category Selector */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">
                    <i className="fas fa-search mr-2"></i>
                    Unified Search
                </h3>
                
                {/* Category Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {Object.entries(categoryConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                category === key
                                    ? `bg-${config.color}-500 text-white shadow-md`
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <i className={`fas ${config.icon} mr-2`}></i>
                            {config.label}
                        </button>
                    ))}
                </div>
                
                {/* Search Controls */}
                <div className="flex gap-4">
                    <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        {categoryConfig[category].searchFields.map(field => (
                            <option key={field} value={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search ${categoryConfig[category].label.toLowerCase()} by ${searchBy}...`}
                        className="flex-1 px-4 py-2 border rounded"
                    />
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                    Found {filteredData.length} of {allData.length} {categoryConfig[category].label.toLowerCase()}
                </p>
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">
                    {categoryConfig[category].label} Results
                </h3>
                {filteredData.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        {searchTerm ? `No ${categoryConfig[category].label.toLowerCase()} found matching your search` : `No ${categoryConfig[category].label.toLowerCase()} available`}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {filteredData.map(item => renderDataItem(item))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Legacy Search Events Tab - Search and view all events (REMOVED - replaced by UnifiedSearchTab)
function SearchEventsTab_LEGACY({ user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        fetchAllEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [searchTerm, searchBy, allEvents]);

    const fetchAllEvents = async () => {
        setLoading(true);
        try {
            const headers = {
                'x-user-role': user.role,
                'x-user-id': user.id || '1'
            };

            const response = await fetch(`${API_BASE}/api/events`, { headers });
            const events = await response.json();
            setAllEvents(events);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        if (!searchTerm) {
            setFilteredEvents(allEvents);
            return;
        }

        const filtered = allEvents.filter(event => {
            const searchValue = searchTerm.toLowerCase();
            switch (searchBy) {
                case 'id':
                    return event.id.toString().includes(searchValue);
                case 'title':
                    return event.title.toLowerCase().includes(searchValue);
                case 'category':
                    return event.category.toLowerCase().includes(searchValue);
                case 'location':
                    return event.location.toLowerCase().includes(searchValue);
                case 'college':
                    return event.college.toLowerCase().includes(searchValue);
                default:
                    return event.title.toLowerCase().includes(searchValue);
            }
        });
        setFilteredEvents(filtered);
    };

    const handleDelete = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        try {
            const response = await fetch(`${API_BASE}/api/admin/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                }
            });
            
            if (response.ok) {
                alert('Event deleted successfully!');
                fetchAllEvents();
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        }
    };

    const handleUpdate = async (eventId) => {
        const eventToEdit = allEvents.find(e => e.id === eventId);
        setEditingEvent(eventToEdit);
    };

    const handleSaveUpdate = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/events/${editingEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(editingEvent)
            });
            
            if (response.ok) {
                alert('Event updated successfully!');
                setEditingEvent(null);
                fetchAllEvents();
            } else {
                alert('Failed to update event');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Error updating event');
        }
    };

    if (loading) return <div className="text-center py-8">Loading events...</div>;

    return (
        <div className="space-y-6">
            {/* Edit Modal */}
            {editingEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Edit Event</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    value={editingEvent.title}
                                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input
                                    value={editingEvent.category}
                                    onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input
                                    type="date"
                                    value={editingEvent.date}
                                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    value={editingEvent.location}
                                    onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">College</label>
                                <input
                                    value={editingEvent.college}
                                    onChange={(e) => setEditingEvent({...editingEvent, college: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={editingEvent.description}
                                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditingEvent(null)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUpdate}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Controls */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Search Events</h3>
                <div className="flex gap-4 mb-4">
                    <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="title">Title</option>
                        <option value="id">ID</option>
                        <option value="category">Category</option>
                        <option value="location">Location</option>
                        <option value="college">College</option>
                    </select>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search by ${searchBy}...`}
                        className="flex-1 px-4 py-2 border rounded"
                    />
                </div>
                <p className="text-sm text-gray-600">
                    Found {filteredEvents.length} of {allEvents.length} events
                </p>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">All Events</h3>
                {filteredEvents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        {searchTerm ? 'No events found matching your search' : 'No events available'}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                ID: {event.id}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                event.category === 'Academic' ? 'bg-purple-100 text-purple-800' :
                                                event.category === 'Cultural' ? 'bg-green-100 text-green-800' :
                                                event.category === 'Sports' ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {event.category}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                                        <p className="text-gray-600 mb-3">{event.description}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                                            <div>
                                                <i className="fas fa-calendar mr-1"></i>
                                                {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                                            </div>
                                            <div>
                                                <i className="fas fa-map-marker-alt mr-1"></i>
                                                {event.location || 'TBD'}
                                            </div>
                                            <div>
                                                <i className="fas fa-university mr-1"></i>
                                                {event.college || 'Campus'}
                                            </div>
                                            <div>
                                                <i className="fas fa-users mr-1"></i>
                                                {event.register || 0} registered
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleUpdate(event.id)}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            <i className="fas fa-edit mr-1"></i>Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            <i className="fas fa-trash mr-1"></i>Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Admin Create Achievement Form
function AdminCreateAchievementForm({ user }) {
    const [form, setForm] = useState({ 
        title: '', 
        description: '', 
        department: '', 
        date: '',
        image: ''
    });
    const [status, setStatus] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setStatus({ ok: false, msg: 'Image size should be less than 5MB' });
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                setStatus({ ok: false, msg: 'Please upload an image file' });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setForm({ ...form, image: base64String });
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        
        if (!form.title || !form.department || !form.date) {
            setStatus({ ok: false, msg: 'Please fill all required fields' });
            return;
        }
        
        if (!form.image) {
            setStatus({ ok: false, msg: 'Please select an achievement image' });
            return;
        }
        
        setStatus({ ok: null, msg: 'Uploading achievement...' });
        
        try {
            console.log('Submitting achievement:', { 
                title: form.title, 
                department: form.department, 
                date: form.date,
                imageSize: form.image?.length 
            });
            
            const response = await fetch(`${API_BASE}/api/admin/achievements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(form)
            });
            
            console.log('Response status:', response.status, response.statusText);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok && data.success) {
                setStatus({ ok: true, msg: 'Achievement uploaded successfully! ✅' });
                
                // Add to mockAchievements array for immediate display
                const newAchievement = {
                    id: data.id,
                    title: form.title,
                    description: form.description,
                    department: form.department,
                    date: form.date,
                    image: form.image,
                    approved: true
                };
                mockAchievements.push(newAchievement);
                
                // Dispatch event to update AchievementsPage
                window.dispatchEvent(new CustomEvent('achievementsUpdated'));
                
                // Reset form
                setForm({ title: '', description: '', department: '', date: '', image: '' });
                setImagePreview(null);
                
                // Clear status after 3 seconds
                setTimeout(() => setStatus({ ok: null, msg: '' }), 3000);
            } else {
                console.error('Upload failed:', data);
                setStatus({ ok: false, msg: data.error || 'Failed to upload achievement. Check console for details.' });
            }
        } catch (err) {
            console.error('Achievement submit error:', err);
            setStatus({ ok: false, msg: 'Network error: ' + err.message });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Title *</label>
                <input 
                    required 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                    placeholder="e.g., National Robotics Competition - First Prize" 
                    className="w-full p-3 border rounded" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <input 
                    required
                    value={form.department} 
                    onChange={e => setForm({ ...form, department: e.target.value })} 
                    placeholder="e.g., Computer Science, Sports, etc." 
                    className="w-full p-3 border rounded" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input 
                    required
                    type="date"
                    value={form.date} 
                    onChange={e => setForm({ ...form, date: e.target.value })} 
                    className="w-full p-3 border rounded" 
                />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
                <input 
                    required
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-3 border rounded" 
                />
                <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF (Max size: 5MB)
                </p>
                {imagePreview && (
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-w-xs h-48 object-cover rounded border"
                        />
                    </div>
                )}
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea 
                    required
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                    placeholder="Describe the achievement in detail..." 
                    className="w-full p-3 border rounded" 
                    rows={4}
                />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
                <button type="submit" className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    <i className="fas fa-trophy mr-2"></i>
                    Share Achievement
                </button>
            </div>
            {status && <div className={`md:col-span-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</div>}
        </form>
    );
}
