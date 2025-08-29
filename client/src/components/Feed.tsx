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
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={currentUser}
          onPostUpdated={onPostUpdated}
        />
      ))}
    </div>
  );
};

export default Feed;
