// Achievements Page Component
const { useState, useEffect, useContext } = React;

const AchievementsPage = () => {
    const { dataUpdatedAt, user, triggerDataUpdate } = useContext(AppContext); // trigger re-render when achievements change
    // eslint-disable-next-line no-unused-vars
    const _tick = dataUpdatedAt;
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [achievements, setAchievements] = useState([]);

    // Fetch achievements from API
    useEffect(() => {
        const fetchAchievements = () => {
            fetch('http://localhost:4000/api/achievements')
                .then(res => res.json())
                .then(data => {
                    setAchievements(data);
                })
                .catch(err => console.error('Error fetching achievements:', err));
        };

        fetchAchievements();

        // Listen for achievement updates
        const handleAchievementsUpdate = () => {
            fetchAchievements();
        };

        window.addEventListener('achievementsUpdated', handleAchievementsUpdate);

        return () => {
            window.removeEventListener('achievementsUpdated', handleAchievementsUpdate);
        };
    }, [dataUpdatedAt]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setEditingAchievement({...editingAchievement, image: base64String});
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-shine py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent mb-4">
                            College Achievements
                        </h1>
                        <p className="text-xl text-gray-600">Celebrating excellence and success stories</p>
                    </div>
                    
                    {/* Achievement Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((achievement, index) => (
                            <div key={achievement.id} className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-slide-up border border-blue-100" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="relative h-56 overflow-hidden">
                                    <img 
                                        src={achievement.image} 
                                        alt={achievement.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary">
                                        {achievement.department}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                                        {new Date(achievement.date).toLocaleDateString()}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <span className="inline-flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            <i className="fas fa-trophy mr-2"></i>
                                            Achievement
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors duration-300">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{achievement.description}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        {user && user.role === 'admin' ? (
                                            <div className="flex gap-2 w-full">
                                                <button 
                                                    onClick={() => { setEditingAchievement({...achievement}); setImagePreview(achievement.image || null); setShowEditModal(true); }}
                                                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    <i className="fas fa-edit mr-2"></i>Edit
                                                </button>
                                                <button 
                                                    onClick={async () => {
                                                        if (!confirm('Are you sure?')) return;
                                                        try {
                                                            const response = await fetch(`http://localhost:4000/api/admin/achievements/${achievement.id}`, {
                                                                method: 'DELETE',
                                                                headers: { 'x-user-role': user.role, 'x-user-id': user.id || '1' }
                                                            });
                                                            if (response.ok) {
                                                                alert('Achievement deleted!');
                                                                setAchievements(achievements.filter(a => a.id !== achievement.id));
                                                                if (triggerDataUpdate) triggerDataUpdate();
                                                            }
                                                        } catch (error) {
                                                            console.error('Error:', error);
                                                            alert('Error deleting achievement');
                                                        }
                                                    }}
                                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <i className="fas fa-trash mr-2"></i>Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="text-primary hover:text-blue-700 transition-colors duration-300">
                                                <i className="fas fa-share-alt mr-2"></i>
                                                Share
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit Achievement Modal - Admin Only */}
                    {showEditModal && editingAchievement && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Edit Achievement</h3>
                                    <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-times text-xl"></i>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input 
                                            value={editingAchievement.title} 
                                            onChange={(e) => setEditingAchievement({...editingAchievement, title: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Department</label>
                                        <input 
                                            value={editingAchievement.department || ''} 
                                            onChange={(e) => setEditingAchievement({...editingAchievement, department: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Date</label>
                                        <input 
                                            type="date" 
                                            value={editingAchievement.date || ''} 
                                            onChange={(e) => setEditingAchievement({...editingAchievement, date: e.target.value})} 
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Upload New Image (Optional)</label>
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full p-3 border rounded-lg" 
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supported formats: JPG, PNG, GIF (Max size: 5MB)
                                        </p>
                                        {imagePreview && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="max-w-xs h-48 object-cover rounded border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea 
                                            value={editingAchievement.description || ''} 
                                            onChange={(e) => setEditingAchievement({...editingAchievement, description: e.target.value})} 
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
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`http://localhost:4000/api/admin/achievements/${editingAchievement.id}`, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'x-user-role': user.role,
                                                        'x-user-id': user.id || '1'
                                                    },
                                                    body: JSON.stringify(editingAchievement)
                                                });
                                                if (response.ok) {
                                                    alert('Achievement updated!');
                                                    setAchievements(achievements.map(a => 
                                                        a.id === editingAchievement.id ? editingAchievement : a
                                                    ));
                                                    setShowEditModal(false);
                                                    setEditingAchievement(null);
                                                    if (triggerDataUpdate) triggerDataUpdate();
                                                } else {
                                                    alert('Failed to update');
                                                }
                                            } catch (error) {
                                                console.error('Error:', error);
                                                alert('Error updating achievement');
                                            }
                                        }}
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