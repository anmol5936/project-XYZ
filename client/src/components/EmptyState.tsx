import React from 'react';
import { Plus, MessageCircle, Calendar, MapPin, Building } from 'lucide-react';

interface EmptyStateProps {
  type?: 'feed' | 'comments' | 'events' | 'lostfound' | 'announcements';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'feed',
  title,
  description,
  actionText,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'feed':
        return <MessageCircle className="w-12 h-12 text-gray-400" />;
      case 'comments':
        return <MessageCircle className="w-8 h-8 text-gray-400" />;
      case 'events':
        return <Calendar className="w-12 h-12 text-blue-400" />;
      case 'lostfound':
        return <MapPin className="w-12 h-12 text-yellow-400" />;
      case 'announcements':
        return <Building className="w-12 h-12 text-green-400" />;
      default:
        return <MessageCircle className="w-12 h-12 text-gray-400" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'feed':
        return {
          title: 'No posts yet',
          description: 'Be the first to share something with the campus community!',
          actionText: 'Create your first post'
        };
      case 'comments':
        return {
          title: 'No comments yet',
          description: 'Be the first to share your thoughts!',
          actionText: 'Add a comment'
        };
      case 'events':
        return {
          title: 'No events scheduled',
          description: 'Create an event to bring the community together!',
          actionText: 'Create event'
        };
      case 'lostfound':
        return {
          title: 'No lost & found items',
          description: 'Help your fellow students by reporting lost or found items.',
          actionText: 'Report item'
        };
      case 'announcements':
        return {
          title: 'No announcements',
          description: 'Stay tuned for important updates from departments.',
          actionText: 'Create announcement'
        };
      default:
        return {
          title: 'Nothing here yet',
          description: 'Check back later for updates!',
          actionText: 'Get started'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;
  const finalActionText = actionText || defaultContent.actionText;

  return (
    <div className="text-center py-12 px-4">
      <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        {getIcon()}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {finalTitle}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {finalDescription}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {finalActionText}
        </button>
      )}

      {/* Decorative elements */}
      <div className="mt-8 flex justify-center space-x-2">
        <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-indigo-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default EmptyState;
