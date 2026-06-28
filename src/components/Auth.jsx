import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', department: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Retrieve existing accounts database from localStorage
    const accounts = JSON.parse(localStorage.getItem('mock_accounts') || '[]');

    if (isLogin) {
      // --- LOGIN LOGIC ---
      const user = accounts.find(a => a.email === formData.email && a.password === formData.password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Invalid email credentials or password matrix match.');
      }
    } else {
      // --- REGISTRATION LOGIC ---
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.department) {
        setError('All matrix validation arrays must be complete.');
        return;
      }

      if (accounts.some(a => a.email === formData.email)) {
        setError('This email terminal registration already exists.');
        return;
      }

      const newAccount = {
        id: 'user_' + Date.now(), // Unique runtime owner token
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        password: formData.password
      };

      accounts.push(newAccount);
      localStorage.setItem('mock_accounts', JSON.stringify(accounts));
      
      // Auto-login upon successful registration
      onAuthSuccess(newAccount);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent text-center mb-2">
          {isLogin ? '🔒 Secure Portal Access' : '✨ Register System Node'}
        </h2>
        <p className="text-slate-500 text-xs text-center mb-6">
          {isLogin ? 'Enter authorization keys to manage directories.' : 'Provision a new identity workspace within the system.'}
        </p>

        {error && (
          <div className="p-3 mb-4 text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xxs font-bold text-slate-400 uppercase mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg outline-none text-slate-100 focus:border-blue-500"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xxs font-bold text-slate-400 uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg outline-none text-slate-100 focus:border-blue-500"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xxs font-bold text-slate-400 uppercase mb-1">Department Assigned</label>
              <input
                type="text"
                className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg outline-none text-slate-100 focus:border-blue-500"
                placeholder="Engineering, Cyber Operations, HR..."
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-xxs font-bold text-slate-400 uppercase mb-1">System Email Address</label>
            <input
              type="email"
              className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg outline-none text-slate-100 focus:border-blue-500"
              placeholder="operator@network.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xxs font-bold text-slate-400 uppercase mb-1">Security Token / Password</label>
            <input
              type="password"
              className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg outline-none text-slate-100 focus:border-blue-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-xs text-white shadow-lg shadow-blue-600/10 active:scale-95 transition"
          >
            {isLogin ? 'Authenticate Access' : 'Deploy Node Profile'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs text-slate-400 hover:text-blue-400 transition"
          >
            {isLogin ? "Don't have an access key? Register node profile" : 'Already provisioned? Authenticate terminal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;