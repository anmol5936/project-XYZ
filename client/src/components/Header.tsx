import React from 'react';
import { Plus, RefreshCw, User, MessageCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType;
  onCreatePost: () => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onCreatePost, onRefresh }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                NIT Rourkela Feed
              </h1>
              <p className="text-sm text-gray-500 font-medium">Campus Community</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="btn btn-ghost p-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
              title="Refresh feed"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={onCreatePost}
              className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Create Post</span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200/50">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500 font-medium">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
