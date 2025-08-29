import React from 'react';
import { Post, User } from '../types';
import PostCard from './PostCard';
import EmptyState from './EmptyState';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  onPostUpdated: (post: Post) => void;
  onCreatePost?: () => void;
}

const Feed: React.FC<FeedProps> = ({ posts, currentUser, onPostUpdated, onCreatePost }) => {
  if (posts.length === 0) {
    return (
      <EmptyState
        type="feed"
        onAction={onCreatePost}
      />
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {posts.map((post, index) => (
        <div 
          key={post._id}
          className="animate-fadeIn"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PostCard
            post={post}
            currentUser={currentUser}
            onPostUpdated={onPostUpdated}
          />
        </div>
      ))}
    </div>
  );
};

export default Feed;
