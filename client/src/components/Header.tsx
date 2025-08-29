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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                NIT Rourkela Feed
              </h1>
              <p className="text-sm text-gray-500">Campus Community</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="btn btn-ghost"
              title="Refresh feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onCreatePost}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Post</span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
