// Enhanced Events Page Component
const { useState, useEffect, useContext } = React;

const EventsPage = () => {
    const { dataUpdatedAt, user, isAuthenticated, triggerDataUpdate } = useContext(AppContext);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [registrationData, setRegistrationData] = useState({
        fullName: '',
        email: '',
        contact: '',
        collegeName: '',
        year: '',
        department: '',
        studentId: '',
        collegeId: null
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/events');
                const data = await response.json();
                setEvents(data || []);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            }
        };
        
        fetchEvents();
        
        // Listen for events updates from admin panel
        const handleEventsUpdate = () => {
            fetchEvents();
        };
        window.addEventListener('eventsUpdated', handleEventsUpdate);
        return () => window.removeEventListener('eventsUpdated', handleEventsUpdate);
    }, []);

    // Auto-fill registration form when user is logged in and modal opens
    // Pull ALL details from user profile (Dashboard data)
    useEffect(() => {
        if (showModal && isAuthenticated && user) {
            setRegistrationData({
                fullName: user.name || '',
                email: user.email || '',
                contact: user.contact || '',
                collegeName: user.college || '',
                year: user.year || '',
                department: user.department || '',
                studentId: user.studentId || '',
                collegeId: null
            });
        }
    }, [showModal, isAuthenticated, user]);

    const computeFiltered = () => {
        let filtered = events;
        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(event => event.category === selectedCategory);
        }
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(event => 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredEvents(filtered);
    };

    useEffect(() => {
        computeFiltered();
    }, [searchTerm, selectedCategory, events]);

    // Admin functions
    const handleEditEvent = (event) => {
        setEditingEvent({...event});
        setShowEditModal(true);
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/admin/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                }
            });

            if (response.ok) {
                alert('Event deleted successfully!');
                // Update events state
                setEvents(events.filter(e => e.id !== eventId));
                if (triggerDataUpdate) triggerDataUpdate();
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        }
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/events/${editingEvent.id}`, {
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
                // Update events state
                setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
                setShowEditModal(false);
                setEditingEvent(null);
                if (triggerDataUpdate) triggerDataUpdate();
            } else {
                alert('Failed to update event');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Error updating event');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-shine py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent mb-4">
                            Upcoming Events
                        </h1>
                        <p className="text-xl text-gray-600">Discover amazing events happening on campus</p>
                    </div>
                    
                    {/* Enhanced Filters */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100 animate-slide-up">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-search text-gray-400 group-focus-within:text-primary transition-colors duration-300"></i>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary transition-all duration-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select 
                                className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary transition-all duration-300 bg-white"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                <option value="Academic">Academic</option>
                                <option value="Cultural">Cultural</option>
                                <option value="Sports">Sports</option>
                                <option value="Technical">Technical</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Results Counter */}
                    <div className="mb-6 text-center">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-blue-600">{filteredEvents.length}</span> events
                            {selectedCategory !== 'All' && (
                                <span> in <span className="font-semibold text-purple-600">{selectedCategory}</span></span>
                            )}
                        </p>
                    </div>

                    {/* Enhanced Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event, index) => (
                            <div key={event.id} className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 animate-slide-up border border-blue-100" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="relative h-48 overflow-hidden">
                                    {event.image ? (
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"></div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary">
                                        {event.category}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center space-x-2 text-white">
                                            <i className="fas fa-calendar text-sm"></i>
                                            <span className="text-sm font-medium">
                                                {new Date(event.date).toLocaleDateString('en-US', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary transition-colors duration-300">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center text-gray-500">
                                            <i className="fas fa-map-marker-alt mr-2 text-red-400"></i>
                                            <span className="text-sm font-medium">{event.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <i className="fas fa-users mr-2 text-green-400"></i>
                                            <span className="text-sm font-medium">{event.register} Registered</span>
                                        </div>
                                    </div>
                                    {user && user.role === 'admin' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEditEvent(event)} 
                                                className="flex-1 bg-blue-500 text-white py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-300"
                                            >
                                                <i className="fas fa-edit mr-2"></i>
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteEvent(event.id)} 
                                                className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition-all duration-300"
                                            >
                                                <i className="fas fa-trash mr-2"></i>
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => { setCurrentEvent(event); setShowModal(true); }} className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:animate-bounce-gentle">
                                            <i className="fas fa-ticket-alt mr-2"></i>
                                            Register
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Registration Modal */}
                    {showModal && currentEvent && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Register for: {currentEvent.title}</h3>
                                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-times text-xl"></i>
                                    </button>
                                </div>

                                {isAuthenticated && user && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span className="text-sm text-green-700">Your details have been auto-filled. You can edit them if needed.</span>
                                    </div>
                                )}

                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    
                                    try {
                                        // Convert college ID image to base64 if present
                                        let collegeIdImage = null;
                                        if (registrationData.collegeId) {
                                            const reader = new FileReader();
                                            collegeIdImage = await new Promise((resolve, reject) => {
                                                reader.onloadend = () => resolve(reader.result);
                                                reader.onerror = reject;
                                                reader.readAsDataURL(registrationData.collegeId);
                                            });
                                        }
                                        
                                        const response = await fetch('http://localhost:4000/api/event-registrations', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'x-user-role': user?.role || 'guest',
                                                'x-user-id': user?.id || ''
                                            },
                                            body: JSON.stringify({
                                                eventId: currentEvent.id,
                                                fullName: registrationData.fullName,
                                                email: registrationData.email,
                                                contact: registrationData.contact,
                                                collegeName: registrationData.collegeName,
                                                year: registrationData.year,
                                                department: registrationData.department,
                                                studentId: registrationData.studentId,
                                                collegeIdImage: collegeIdImage
                                            })
                                        });
                                        
                                        if (response.ok) {
                                            alert('Registration successful! Admin will review your application.');
                                            setShowModal(false);
                                            setRegistrationData({ fullName:'', email:'', contact:'', collegeName:'', year:'', department:'', studentId:'', collegeId: null });
                                        } else {
                                            const error = await response.json();
                                            alert('Registration failed: ' + (error.error || 'Unknown error'));
                                        }
                                    } catch (error) {
                                        console.error('Registration error:', error);
                                        alert('Registration error: ' + error.message);
                                    }
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input required value={registrationData.fullName} onChange={(e)=>setRegistrationData({...registrationData, fullName: e.target.value})} placeholder="Full Name" className="px-4 py-3 border rounded" />
                                        <input required type="email" value={registrationData.email} onChange={(e)=>setRegistrationData({...registrationData, email: e.target.value})} placeholder="Email" className="px-4 py-3 border rounded" />
                                        <input value={registrationData.studentId} onChange={(e)=>setRegistrationData({...registrationData, studentId: e.target.value})} placeholder="Student ID (optional)" className="px-4 py-3 border rounded" />
                                        <input required value={registrationData.contact} onChange={(e)=>setRegistrationData({...registrationData, contact: e.target.value})} placeholder="Contact Number" className="px-4 py-3 border rounded" />
                                        <input required value={registrationData.collegeName} onChange={(e)=>setRegistrationData({...registrationData, collegeName: e.target.value})} placeholder="College Name" className="px-4 py-3 border rounded" />
                                        <input required value={registrationData.year} onChange={(e)=>setRegistrationData({...registrationData, year: e.target.value})} placeholder="Year (e.g., 3rd Year)" className="px-4 py-3 border rounded" />
                                        <input required value={registrationData.department} onChange={(e)=>setRegistrationData({...registrationData, department: e.target.value})} placeholder="Department" className="px-4 py-3 border rounded" />
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2">College ID Photo</label>
                                            <input type="file" accept="image/*" onChange={(e)=>setRegistrationData({...registrationData, collegeId: e.target.files[0]})} className="w-full" />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded">Submit Registration</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* No Events Found Message */}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <i className="fas fa-calendar-times text-6xl text-gray-300"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-500 mb-2">No events found</h3>
                            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Edit Event Modal - Admin Only */}
                    {showEditModal && editingEvent && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Edit Event</h3>
                                    <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-times text-xl"></i>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input 
                                            value={editingEvent.title} 
                                            onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Category</label>
                                            <select
                                                value={editingEvent.category} 
                                                onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})} 
                                                className="w-full p-3 border rounded-lg"
                                            >
                                                <option value="Academic">Academic</option>
                                                <option value="Cultural">Cultural</option>
                                                <option value="Sports">Sports</option>
                                                <option value="Technical">Technical</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Date</label>
                                            <input 
                                                type="date" 
                                                value={editingEvent.date} 
                                                onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} 
                                                className="w-full p-3 border rounded-lg" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Location</label>
                                        <input 
                                            value={editingEvent.location} 
                                            onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea 
                                            value={editingEvent.description} 
                                            onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                            rows="4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">College</label>
                                        <input 
                                            value={editingEvent.college || ''} 
                                            onChange={(e) => setEditingEvent({...editingEvent, college: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Event Image</label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditingEvent({...editingEvent, image: reader.result});
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                        {editingEvent.image && (
                                            <img src={editingEvent.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
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
        </div>
    );
};