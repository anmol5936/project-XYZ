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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to NIT Rourkela Feed
          </h1>
          <p className="text-gray-600">
            Join the campus community and start sharing updates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">
              What's your name?
            </label>
            <input
              type="text"
              className="form-input"
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
            className="btn btn-primary w-full"
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <>
                <div className="loading-spinner w-4 h-4"></div>
                Setting up...
              </>
            ) : (
              'Get Started'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            No registration required • Cookie-based sessions
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;
