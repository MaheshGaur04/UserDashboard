import React, { useState, useEffect } from 'react';
import { userService } from './services/api';
import UserList from './components/UserList';
import UserModal from './components/UserModal';
import FilterPopup from './components/FilterPopup';
import Pagination from './components/Pagination';
import Auth from './components/Auth';

function App() {
  // Session Security State
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedSession = localStorage.getItem('active_session');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom Success Alert Toast State
  const [successToast, setSuccessToast] = useState('');

  // View Control Pipelines
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ firstName: '', lastName: '', email: '', department: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!loggedInUser) return;

    const fetchInitialUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getUsers();
        
        // Inject Read-Only baseline system tags
        const protectedData = data.map(u => ({ ...u, createdBy: 'system' }));
        
        // Retrieve client side created entries from localStorage persistent memory
        const clientSavedUsers = JSON.parse(localStorage.getItem('mock_client_users') || '[]');
        
        setUsers([...protectedData, ...clientSavedUsers]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialUsers();
  }, [loggedInUser]);

  // Handle Triggering Auto-Hiding Toast
  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast('');
    }, 4000); // Popup automatically disappears after 4 seconds
  };

  const handleAuthSuccess = (userProfile) => {
    localStorage.setItem('active_session', JSON.stringify(userProfile));
    setLoggedInUser(userProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('active_session');
    setLoggedInUser(null);
    setUsers([]);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // --- PROCESSING DATA STREAMS WITH OWNERSHIP PINNING ---
  const processedUsers = users
    .filter(user => {
      const criteria = `${user.firstName} ${user.lastName} ${user.email} ${user.department}`.toLowerCase();
      return criteria.includes(searchTerm.toLowerCase());
    })
    .filter(user => {
      return (
        user.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
        user.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        user.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    })
    .sort((a, b) => {
      // RULE: Check if the records belong to the active logged-in user
      const aIsOwn = a.createdBy === loggedInUser.id;
      const bIsOwn = b.createdBy === loggedInUser.id;

      // Force personal records to pin to the top first
      if (aIsOwn && !bIsOwn) return -1;
      if (!aIsOwn && bIsOwn) return 1;

      // If both are yours (or both are system profiles), fall back to standard selected sort criteria
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalProcessedItems = processedUsers.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedUsers = processedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // CRUD Operations with Access Controls
  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        // Removed ownership blocker check so anyone can save modifications
        await userService.updateUser(selectedUser.id, formData);
        
        const updatedList = users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u);
        setUsers(updatedList);
        
        const clientCreated = updatedList.filter(u => u.createdBy !== 'system');
        localStorage.setItem('mock_client_users', JSON.stringify(clientCreated));
        
        showToast("📝 Profile record updated successfully!");
      } else {
        await userService.createUser(formData);
        
        const newProfileNode = { 
          ...formData, 
          id: 'profile_' + Date.now(), 
          createdBy: loggedInUser.id 
        };

        const updatedList = [...users, newProfileNode];
        setUsers(updatedList);

        const clientCreated = updatedList.filter(u => u.createdBy !== 'system');
        localStorage.setItem('mock_client_users', JSON.stringify(clientCreated));
        
        showToast("✨ New profile record added successfully!");
        setCurrentPage(1);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    // Removed access-denied check so anyone can delete any record
    if (window.confirm("Verify node destruction instructions?")) {
      try {
        await userService.deleteUser(id);
        const filteredList = users.filter(user => user.id !== id);
        setUsers(filteredList);

        const clientCreated = filteredList.filter(u => u.createdBy !== 'system');
        localStorage.setItem('mock_client_users', JSON.stringify(clientCreated));
        
        showToast("🗑️ Profile record deleted successfully!");
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  if (!loggedInUser) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 relative">
      
      {/* Floating Interactive Toast Alert */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <span>{successToast}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Nav Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              User Management Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Active Operator: <span className="text-blue-400 font-bold">{loggedInUser.firstName} {loggedInUser.lastName}</span> ({loggedInUser.department})
            </p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <button 
              onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-sm shadow-lg transition"
            >
              + Add New Profile
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Controls Grid */}
        <div className="flex flex-col md:flex-row gap-3 mb-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="🔍 Global keyword query directory search..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-200"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="relative flex justify-end gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2.5 text-sm font-semibold border rounded-xl transition ${
                Object.values(filters).some(Boolean) ? 'bg-blue-900/30 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              ⚙️ Advanced Filters
            </button>
            <FilterPopup 
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onFilterChange={(field, val) => { setFilters(p=>({...p, [field]:val})); setCurrentPage(1); }}
              onReset={() => { setFilters({firstName:'', lastName:'', email:'', department:''}); setCurrentPage(1); }}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-200 bg-red-900/40 border border-red-500/30 rounded-xl flex justify-between items-center">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="hover:underline text-xs font-bold">Dismiss</button>
          </div>
        )}

        {/* Data Stream Box */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-slate-400">Syncing node directory matrices...</div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
            <UserList 
              users={paginatedUsers} 
              onEdit={(user) => { setSelectedUser(user); setIsModalOpen(true); }} 
              onDelete={handleDeleteUser}
              onSort={handleSort}
              sortConfig={sortConfig}
              currentUserId={loggedInUser.id}
            />
            <Pagination 
              totalItems={totalProcessedItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onLimitChange={(lim) => { setItemsPerPage(lim); setCurrentPage(1); }}
            />
          </div>
        )}
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        currentUser={selectedUser}
      />
    </div>
  );
}

export default App;