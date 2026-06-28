import React from 'react';

const UserList = ({ users, onDelete, onEdit, onSort, sortConfig, currentUserId }) => {
  
  const getSortIndicator = (key) => {
    if (!sortConfig || sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  if (users.length === 0) {
    return <div className="text-center p-12 text-slate-400 font-medium">No system users found matching standard matrices.</div>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left text-slate-300 whitespace-nowrap">
        <thead className="text-xs uppercase bg-slate-800 border-b border-slate-700 text-slate-400 font-bold tracking-wider">
          <tr>
            <th onClick={() => onSort('id')} className="px-6 py-4 cursor-pointer hover:bg-slate-700/30 select-none">ID{getSortIndicator('id')}</th>
            <th onClick={() => onSort('firstName')} className="px-6 py-4 cursor-pointer hover:bg-slate-700/30 select-none">First Name{getSortIndicator('firstName')}</th>
            <th onClick={() => onSort('lastName')} className="px-6 py-4 cursor-pointer hover:bg-slate-700/30 select-none">Last Name{getSortIndicator('lastName')}</th>
            <th onClick={() => onSort('email')} className="px-6 py-4 cursor-pointer hover:bg-slate-700/30 select-none">Email Matrix{getSortIndicator('email')}</th>
            <th onClick={() => onSort('department')} className="px-6 py-4 cursor-pointer hover:bg-slate-700/30 select-none">Department Space{getSortIndicator('department')}</th>
            <th className="px-6 py-4 text-center">Actions Permissions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {users.map((user) => {
            // Check if this record belongs to the currently logged-in user
            const isOwner = user.createdBy === currentUserId;

            return (
              <tr 
                key={user.id} 
                className={`transition-colors relative ${
                  isOwner 
                    ? 'bg-blue-950/20 hover:bg-blue-950/30 border-l-4 border-l-blue-500' 
                    : 'hover:bg-slate-800/40 border-l-4 border-l-transparent'
                }`}
              >
                <td className="px-6 py-4 font-bold text-slate-400">
                  {isOwner ? (
                    <span className="flex items-center gap-1.5 text-blue-400">
                      ⭐ #{user.id.toString().split('_')[1] ? 'New' : user.id}
                    </span>
                  ) : (
                    `#${user.id}`
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-slate-100">{user.firstName}</td>
                <td className="px-6 py-4 text-slate-100">{user.lastName}</td>
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs border rounded-md ${
                    isOwner 
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                  }`}>
                    {user.department}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {/* Every single user can now access the edit and delete triggers! */}
                  <div className="space-x-2">
                    <button 
                      onClick={() => onEdit(user)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition border ${
                        isOwner
                          ? 'bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/30 text-blue-200'
                          : 'bg-slate-700 hover:bg-slate-600 border-slate-600/50 text-slate-200'
                      }`}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(user.id)}
                      className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 text-xs font-semibold rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;