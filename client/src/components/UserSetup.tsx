import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UserSetupProps {
  onUserSetup: (name: string) => void;
}

const UserSetup: React.FC<UserSetupProps> = ({ onUserSetup }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onUserSetup(name.trim());
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-lg mx-4 border border-white/20">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Welcome to NIT Rourkela Feed
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Join the campus community and start sharing updates with fellow students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-group">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              What's your name?
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="loading-spinner w-5 h-5"></div>
                Setting up your profile...
              </div>
            ) : (
              'Get Started'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p>No registration required • Secure cookie-based sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;
