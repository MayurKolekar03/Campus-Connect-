// Opportunities Page Component
const { useState, useEffect, useContext } = React;

const OpportunitiesPage = () => {
    const { dataUpdatedAt, user, triggerDataUpdate } = useContext(AppContext);
    const [selectedType, setSelectedType] = useState('All');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingOpp, setEditingOpp] = useState(null);
    const initialOpportunities = [
        {
            id: 1,
            title: "Summer Software Engineering Intern",
            company: "Google",
            type: "Internship",
            location: "Mountain View, CA",
            deadline: "2025-09-15",
            description: "Join our team for an exciting summer internship program...",
            requirements: ["CS Major", "Python/Java", "3.5+ GPA"]
        },
        {
            id: 2,
            title: "Global Hackathon 2025",
            company: "Microsoft",
            type: "Hackathon",
            location: "Virtual",
            deadline: "2025-08-30",
            description: "48-hour coding challenge with $50K in prizes...",
            requirements: ["Any Major", "Programming Skills", "Team of 2-4"]
        },
        {
            id: 3,
            title: "Research Assistant - AI Lab",
            company: "University Research Lab",
            type: "Research",
            location: "Campus",
            deadline: "2025-08-20",
            description: "Undergraduate research opportunity in machine learning...",
            requirements: ["CS/Math Major", "Python", "Research Interest"]
        }
    ];

    const [opportunities, setOpportunities] = useState(window.mockOpportunities && window.mockOpportunities.length ? window.mockOpportunities : initialOpportunities);
    const [savedOpportunities, setSavedOpportunities] = useState(new Set());

    // Fetch opportunities from backend on mount
    useEffect(() => {
        fetchOpportunities();
        
        // Listen for opportunities updates from admin panel
        const handleOpportunitiesUpdate = () => {
            fetchOpportunities();
        };
        window.addEventListener('opportunitiesUpdated', handleOpportunitiesUpdate);
        
        return () => {
            window.removeEventListener('opportunitiesUpdated', handleOpportunitiesUpdate);
        };
    }, []);

    useEffect(() => {
        if (window.mockOpportunities && window.mockOpportunities.length) setOpportunities(window.mockOpportunities);
    }, [dataUpdatedAt]);

    const fetchOpportunities = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/opportunities');
            const data = await response.json();
            if (data && data.length > 0) {
                setOpportunities(data);
                window.mockOpportunities = data;
            }
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        }
    };

    const handleEditOpportunity = (opp) => {
        setEditingOpp({...opp});
        setShowEditModal(true);
    };

    const handleDeleteOpportunity = async (oppId) => {
        if (!confirm('Are you sure you want to delete this opportunity?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/admin/opportunities/${oppId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                }
            });

            if (response.ok) {
                alert('Opportunity deleted successfully!');
                fetchOpportunities();
                if (triggerDataUpdate) triggerDataUpdate();
                window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
            } else {
                alert('Failed to delete opportunity');
            }
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            alert('Error deleting opportunity');
        }
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/opportunities/${editingOpp.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(editingOpp)
            });

            if (response.ok) {
                alert('Opportunity updated successfully!');
                setShowEditModal(false);
                setEditingOpp(null);
                fetchOpportunities();
                if (triggerDataUpdate) triggerDataUpdate();
                window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
            } else {
                alert('Failed to update opportunity');
            }
        } catch (error) {
            console.error('Error updating opportunity:', error);
            alert('Error updating opportunity');
        }
    };

    // Load saved opportunities for logged-in user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            fetch(`http://localhost:4000/api/my-saved-opportunities?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    const savedIds = new Set(data.map(item => item.opportunity_id));
                    setSavedOpportunities(savedIds);
                })
                .catch(err => console.error('Error fetching saved opportunities:', err));
        }
    }, []);

    const handleSaveOpportunity = async (opportunityId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('Please log in to save opportunities');
            return;
        }

        try {
            if (savedOpportunities.has(opportunityId)) {
                // Unsave
                await fetch('http://localhost:4000/api/saved-opportunities', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ opportunityId, userId: user.id })
                });
                setSavedOpportunities(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(opportunityId);
                    return newSet;
                });
                alert('Opportunity removed from saved list');
            } else {
                // Save
                await fetch('http://localhost:4000/api/saved-opportunities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ opportunityId, userId: user.id })
                });
                setSavedOpportunities(prev => new Set([...prev, opportunityId]));
                alert('Opportunity saved successfully!');
            }
        } catch (error) {
            console.error('Error saving/unsaving opportunity:', error);
            alert('Error updating saved opportunities');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Opportunities</h1>
                    
                    {/* Filter Tabs */}
                    <div className="flex space-x-4 mb-6">
                        {['All', 'Internships', 'Hackathons', 'Research', 'Jobs'].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === type
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Opportunities List */}
                    <div className="space-y-6">
                        {opportunities
                            .filter(opp => selectedType === 'All' || opp.type === selectedType.slice(0, -1))
                            .map(opportunity => (
                            <div key={opportunity.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">{opportunity.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                opportunity.type === 'Internship' ? 'bg-blue-100 text-blue-800' :
                                                opportunity.type === 'Hackathon' ? 'bg-purple-100 text-purple-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {opportunity.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 font-medium mb-1">{opportunity.company}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                            <span>
                                                <i className="fas fa-map-marker-alt mr-1"></i>
                                                {opportunity.location}
                                            </span>
                                            <span>
                                                <i className="fas fa-clock mr-1"></i>
                                                Due: {new Date(opportunity.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{opportunity.description}</p>
                                        {opportunity.requirements && opportunity.requirements.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {opportunity.requirements.map(req => (
                                                        <span key={req} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                            {req}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2 ml-4">
                                        {user && user.role === 'admin' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleEditOpportunity(opportunity)}
                                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    <i className="fas fa-edit mr-2"></i>Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteOpportunity(opportunity.id)}
                                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <i className="fas fa-trash mr-2"></i>Delete
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                                    Apply Now
                                                </button>
                                                <button 
                                                    onClick={() => handleSaveOpportunity(opportunity.id)}
                                                    className={`px-6 py-2 rounded-lg transition-colors ${
                                                        savedOpportunities.has(opportunity.id)
                                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <i className={`fas ${savedOpportunities.has(opportunity.id) ? 'fa-check' : 'fa-bookmark'} mr-2`}></i>
                                                    {savedOpportunities.has(opportunity.id) ? 'Saved' : 'Save'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit Opportunity Modal - Admin Only */}
                    {showEditModal && editingOpp && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Edit Opportunity</h3>
                                    <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-times text-xl"></i>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input 
                                            value={editingOpp.title} 
                                            onChange={(e) => setEditingOpp({...editingOpp, title: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Company</label>
                                            <input 
                                                value={editingOpp.company || ''} 
                                                onChange={(e) => setEditingOpp({...editingOpp, company: e.target.value})} 
                                                className="w-full p-3 border rounded-lg" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Type</label>
                                            <select
                                                value={editingOpp.type || ''} 
                                                onChange={(e) => setEditingOpp({...editingOpp, type: e.target.value})} 
                                                className="w-full p-3 border rounded-lg"
                                            >
                                                <option value="Internship">Internship</option>
                                                <option value="Job">Job</option>
                                                <option value="Hackathon">Hackathon</option>
                                                <option value="Research">Research</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Location</label>
                                            <input 
                                                value={editingOpp.location || ''} 
                                                onChange={(e) => setEditingOpp({...editingOpp, location: e.target.value})} 
                                                className="w-full p-3 border rounded-lg" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Deadline</label>
                                            <input 
                                                type="date" 
                                                value={editingOpp.deadline || ''} 
                                                onChange={(e) => setEditingOpp({...editingOpp, deadline: e.target.value})} 
                                                className="w-full p-3 border rounded-lg" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea 
                                            value={editingOpp.description || ''} 
                                            onChange={(e) => setEditingOpp({...editingOpp, description: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                            rows="4"
                                        />
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