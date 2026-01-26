// Clubs Page Component
const { useState, useEffect, useContext } = React;

const ClubsPage = () => {
    const { isAuthenticated, user, dataUpdatedAt, triggerDataUpdate } = useContext(AppContext);
    const [showInfo, setShowInfo] = useState(false);
    const [infoClub, setInfoClub] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClub, setEditingClub] = useState(null);
    const [applicationForm, setApplicationForm] = useState({
        name: '',
        email: '',
        studentId: '',
        department: '',
        year: '',
        message: ''
    });
    const [applicationStatus, setApplicationStatus] = useState(null);

    const openInfo = (club) => {
        setInfoClub(club);
        setShowInfo(true);
    };

    const openApplicationForm = (club) => {
        setSelectedClub(club);
        // Auto-fill user details
        setApplicationForm({
            name: user?.name || '',
            email: user?.email || '',
            studentId: user?.studentId || '',
            department: user?.department || '',
            year: user?.year || '',
            message: ''
        });
        setShowApplicationForm(true);
        setApplicationStatus(null);
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:4000/api/clubs/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user?.role || 'student',
                    'x-user-id': user?.id || '1'
                },
                body: JSON.stringify({
                    clubId: selectedClub.id,
                    clubName: selectedClub.name,
                    ...applicationForm
                })
            });

            if (response.ok) {
                setApplicationStatus({ ok: true, msg: 'Application submitted successfully! Admin will review it soon.' });
                setTimeout(() => {
                    setShowApplicationForm(false);
                    setApplicationStatus(null);
                }, 2000);
            } else {
                setApplicationStatus({ ok: false, msg: 'Failed to submit application. Please try again.' });
            }
        } catch (error) {
            console.error('Application error:', error);
            setApplicationStatus({ ok: false, msg: 'Network error. Please check your connection.' });
        }
    };

    const initialClubs = [
        {
            id: 1,
            name: "Computer Science Society",
            category: "Technical",
            members: 250,
            description: "Promoting excellence in computer science through workshops, competitions, and networking events.",
            image: "bg-blue-500",
            isFollowing: false
        },
        {
            id: 2,
            name: "Robotics Club",
            category: "Technical",
            members: 120,
            description: "Building robots, competing in tournaments, and exploring automation technologies.",
            image: "bg-red-500",
            isFollowing: false
        },
        {
            id: 3,
            name: "Drama Society",
            category: "Cultural",
            members: 85,
            description: "Bringing stories to life through theatrical performances and creative expression.",
            image: "bg-purple-500",
            isFollowing: false
        }
    ];

    const [clubs, setClubs] = useState(window.mockClubs && window.mockClubs.length ? window.mockClubs : initialClubs);

    // Fetch clubs from backend on mount
    useEffect(() => {
        fetchClubs();
        
        // Listen for club updates from admin panel
        const handleClubsUpdate = () => {
            fetchClubs();
        };
        window.addEventListener('clubsUpdated', handleClubsUpdate);
        
        return () => {
            window.removeEventListener('clubsUpdated', handleClubsUpdate);
        };
    }, []);

    // keep in sync when admin adds a club (AppContext.notifyDataChange)
    useEffect(() => {
        if (window.mockClubs && window.mockClubs.length) setClubs(window.mockClubs);
    }, [dataUpdatedAt]);

    const fetchClubs = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/clubs');
            const data = await response.json();
            if (data && data.length > 0) {
                setClubs(data);
                // Update window.mockClubs to keep in sync
                window.mockClubs = data;
            }
        } catch (error) {
            console.error('Error fetching clubs:', error);
            // Fallback to mockData if API fails
        }
    };

    const handleEditClub = (club) => {
        setEditingClub({...club});
        setShowEditModal(true);
    };

    const handleDeleteClub = async (clubId) => {
        if (!confirm('Are you sure you want to delete this club?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/admin/clubs/${clubId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                }
            });

            if (response.ok) {
                alert('Club deleted successfully!');
                fetchClubs();
                if (triggerDataUpdate) triggerDataUpdate();
                window.dispatchEvent(new CustomEvent('clubsUpdated'));
            } else {
                alert('Failed to delete club');
            }
        } catch (error) {
            console.error('Error deleting club:', error);
            alert('Error deleting club');
        }
    };

    const handleSaveEdit = async () => {
        try {
            console.log('🔄 Updating club:', editingClub);
            
            const response = await fetch(`http://localhost:4000/api/admin/clubs/${editingClub.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user?.role || 'admin',
                    'x-user-id': user?.id || '1'
                },
                body: JSON.stringify(editingClub)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                alert('✅ Club updated successfully!');
                setShowEditModal(false);
                setEditingClub(null);
                fetchClubs();
                if (triggerDataUpdate) triggerDataUpdate();
                window.dispatchEvent(new CustomEvent('clubsUpdated'));
            } else {
                console.error('Update failed:', data);
                alert('Failed to update club: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating club:', error);
            alert('Error updating club: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Clubs & Societies</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map(club => (
                        <div key={club.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-40 relative overflow-hidden">
                                {club.image && club.image.startsWith('data:') ? (
                                    <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full ${club.image || 'bg-gradient-to-br from-blue-400 to-purple-500'}`}></div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                        {club.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{club.name}</h3>
                                <p className="text-gray-600 mb-4">{club.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-500 flex items-center">
                                        <i className="fas fa-users mr-2"></i>
                                        {club.members} members
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    {user && user.role === 'admin' ? (
                                        <>
                                            <button 
                                                onClick={() => handleEditClub(club)}
                                                className="flex-1 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                            >
                                                <i className="fas fa-edit mr-2"></i>Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClub(club.id)}
                                                className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <i className="fas fa-trash mr-2"></i>Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {isAuthenticated ? (
                                                <button 
                                                    onClick={() => openApplicationForm(club)}
                                                    className="flex-1 py-2 rounded-lg transition-colors bg-primary text-white hover:bg-blue-700"
                                                >
                                                    Apply Now
                                                </button>
                                            ) : (
                                                <div className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center">Login to Apply</div>
                                            )}
                                            <button onClick={() => openInfo(club)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                <i className="fas fa-info"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Club Info Modal */}
                {showInfo && infoClub && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-2xl max-w-xl w-full p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">{infoClub.name}</h2>
                                    <p className="text-sm text-gray-500">{infoClub.category} • {infoClub.members} members</p>
                                </div>
                                <button onClick={() => setShowInfo(false)} className="text-gray-500">Close</button>
                            </div>
                            <div className="mt-4 text-gray-700">
                                {infoClub.description}
                            </div>
                            <div className="mt-6 text-right">
                                <button onClick={() => setShowInfo(false)} className="px-4 py-2 bg-primary text-white rounded">OK</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Club Application Form Modal */}
                {showApplicationForm && selectedClub && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Apply to {selectedClub.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedClub.category}</p>
                                </div>
                                <button 
                                    onClick={() => setShowApplicationForm(false)} 
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleApplicationSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={applicationForm.name}
                                            onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                                            className="w-full p-3 border rounded-lg bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={applicationForm.email}
                                            onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                                            className="w-full p-3 border rounded-lg bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Student ID *</label>
                                        <input
                                            type="text"
                                            required
                                            value={applicationForm.studentId}
                                            onChange={(e) => setApplicationForm({...applicationForm, studentId: e.target.value})}
                                            className="w-full p-3 border rounded-lg bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                                        <input
                                            type="text"
                                            required
                                            value={applicationForm.department}
                                            onChange={(e) => setApplicationForm({...applicationForm, department: e.target.value})}
                                            className="w-full p-3 border rounded-lg bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                                        <input
                                            type="text"
                                            required
                                            value={applicationForm.year}
                                            onChange={(e) => setApplicationForm({...applicationForm, year: e.target.value})}
                                            className="w-full p-3 border rounded-lg bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Why do you want to join this club? (Optional)
                                    </label>
                                    <textarea
                                        value={applicationForm.message}
                                        onChange={(e) => setApplicationForm({...applicationForm, message: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        rows="4"
                                        placeholder="Tell us about your interest and what you hope to contribute..."
                                    />
                                </div>

                                {applicationStatus && (
                                    <div className={`p-3 rounded-lg ${applicationStatus.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {applicationStatus.msg}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowApplicationForm(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Club Modal - Admin Only */}
                {showEditModal && editingClub && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Edit Club</h3>
                                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Club Name</label>
                                    <input 
                                        value={editingClub.name} 
                                        onChange={(e) => setEditingClub({...editingClub, name: e.target.value})} 
                                        className="w-full p-3 border rounded-lg" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input 
                                        value={editingClub.category || ''} 
                                        onChange={(e) => setEditingClub({...editingClub, category: e.target.value})} 
                                        className="w-full p-3 border rounded-lg" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Members</label>
                                    <input 
                                        type="number"
                                        value={editingClub.members || ''} 
                                        onChange={(e) => setEditingClub({...editingClub, members: e.target.value})} 
                                        className="w-full p-3 border rounded-lg" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea 
                                        value={editingClub.description || ''} 
                                        onChange={(e) => setEditingClub({...editingClub, description: e.target.value})} 
                                        className="w-full p-3 border rounded-lg" 
                                        rows="4"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Club Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setEditingClub({...editingClub, image: reader.result});
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} 
                                        className="w-full p-3 border rounded-lg" 
                                    />
                                    {editingClub.image && editingClub.image.startsWith('data:') && (
                                        <img src={editingClub.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    onClick={() => setShowEditModal(false)} 
                                    className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveEdit} 
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};