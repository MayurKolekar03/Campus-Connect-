// News Page Component
const { useState, useEffect, useContext } = React;

const NewsPage = () => {
    const { dataUpdatedAt, user, triggerDataUpdate } = useContext(AppContext); // used to re-render when data changes
    // eslint-disable-next-line no-unused-vars
    const _tick = dataUpdatedAt;
    const [news, setNews] = useState(mockNews || []);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    
    // Fetch news from backend on mount
    useEffect(() => {
        fetchNews();
        
        // Listen for news updates from admin panel
        const handleNewsUpdate = () => {
            fetchNews();
        };
        window.addEventListener('newsUpdated', handleNewsUpdate);
        
        return () => {
            window.removeEventListener('newsUpdated', handleNewsUpdate);
        };
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/news');
            const data = await response.json();
            if (data && data.length > 0) {
                setNews(data);
                // Also update mockNews
                mockNews.length = 0;
                mockNews.push(...data);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const handleEditNews = (newsItem) => {
        setEditingNews({...newsItem});
        setShowEditModal(true);
    };

    const handleDeleteNews = async (newsId) => {
        if (!confirm('Are you sure you want to delete this news?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/admin/news/${newsId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                }
            });

            if (response.ok) {
                alert('News deleted successfully!');
                fetchNews();
                if (triggerDataUpdate) triggerDataUpdate();
                window.dispatchEvent(new CustomEvent('newsUpdated'));
            } else {
                alert('Failed to delete news');
            }
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Error deleting news');
        }
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/news/${editingNews.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': user.role,
                    'x-user-id': user.id || '1'
                },
                body: JSON.stringify(editingNews)
            });

            if (response.ok) {
                alert('News updated successfully!');
                setShowEditModal(false);
                setEditingNews(null);
                fetchNews();
                if (triggerDataUpdate) triggerDataUpdate();
                window.dispatchEvent(new CustomEvent('newsUpdated'));
            } else {
                alert('Failed to update news');
            }
        } catch (error) {
            console.error('Error updating news:', error);
            alert('Error updating news');
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-shine py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent mb-4">
                        Campus News
                    </h1>
                    <p className="text-xl text-gray-600">Stay informed with the latest updates</p>
                </div>
                
                <div className="space-y-8">
                    {news.map((newsItem, index) => (
                        <article key={newsItem.id} className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 animate-slide-up border border-blue-100" style={{animationDelay: `${index * 0.1}s`}}>
                            <div className="flex items-center justify-between mb-6">
                                <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    {newsItem.category}
                                </span>
                                <span className="text-gray-500 text-sm font-medium">
                                    {new Date(newsItem.date).toLocaleDateString()}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-gray-800 hover:text-primary transition-colors duration-300">{newsItem.title}</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{newsItem.content}</p>
                            <div className="flex items-center justify-between">
                                {user && user.role === 'admin' ? (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleEditNews(newsItem)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                                        >
                                            <i className="fas fa-edit mr-2"></i>Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteNews(newsItem.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                        >
                                            <i className="fas fa-trash mr-2"></i>Delete
                                        </button>
                                    </div>
                                ) : (
                                    <button className="text-primary hover:text-blue-700 font-semibold transition-colors duration-300 flex items-center group">
                                        Read More 
                                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transform transition-transform duration-300"></i>
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* Edit News Modal - Admin Only */}
                {showEditModal && editingNews && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Edit News</h3>
                                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input 
                                        value={editingNews.title} 
                                        onChange={(e) => setEditingNews({...editingNews, title: e.target.value})} 
                                        className="w-full p-3 border rounded-lg" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input 
                                        value={editingNews.category || ''} 
                                        onChange={(e) => setEditingNews({...editingNews, category: e.target.value})} 
                                        className="w-full p-3 border rounded-lg" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Content</label>
                                    <textarea 
                                        value={editingNews.content} 
                                        onChange={(e) => setEditingNews({...editingNews, content: e.target.value})} 
                                        className="w-full p-3 border rounded-lg" 
                                        rows="6"
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
    );
};