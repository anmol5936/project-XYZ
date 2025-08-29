import React, { useState } from 'react';
import { Calendar, MapPin, Building, Heart, MessageCircle, Users, Clock, Reply } from 'lucide-react';
import { Post, User } from '../types';
import { postsApi } from '../services/api';
import ReactionPicker from './ReactionPicker';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onPostUpdated: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onPostUpdated }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'lostfound': return <MapPin className="w-4 h-4" />;
      case 'announcement': return <Building className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPostTypeBadge = () => {
    const baseClass = "badge ";
    switch (post.type) {
      case 'event': return baseClass + "badge-event";
      case 'lostfound': return baseClass + "badge-lostfound";
      case 'announcement': return baseClass + "badge-announcement";
      default: return baseClass + "badge-event";
    }
  };

  const handleReaction = async (reactionType: string) => {
    try {
      const updatedPost = await postsApi.addReaction(post._id, {
        type: reactionType as any,
        userId: currentUser.userId
      });
      onPostUpdated(updatedPost);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const getUserReaction = () => {
    return post.reactions.find(r => r.userId === currentUser.userId)?.type;
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const updatedPost = await postsApi.addComment(post._id, {
        content: newComment.trim(),
        author: currentUser.name,
        authorId: currentUser.userId
      });
      onPostUpdated(updatedPost);
      setNewComment('');
      setShowComments(true);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (response: 'going' | 'interested' | 'notGoing') => {
    if (post.type !== 'event') return;
    
    try {
      const updatedPost = await postsApi.rsvpToEvent(post._id, {
        response,
        userId: currentUser.userId,
        name: currentUser.name
      });
      onPostUpdated(updatedPost);
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  return (
    <div className="card fade-in hover-lift">
      <div className="card-header">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900">{post.author}</h4>
                <span className={getPostTypeBadge()}>
                  {getPostTypeIcon()}
                  {post.type === 'lostfound' ? 'Lost & Found' : post.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
        <p className="text-gray-700 mb-4">{post.description}</p>

        {/* Type-specific content */}
        {post.type === 'event' && post.eventDetails && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm">
              {post.eventDetails.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  {post.eventDetails.location}
                </div>
              )}
              {post.eventDetails.date && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.eventDetails.date).toLocaleString()}
                </div>
              )}
            </div>
            
            {/* RSVP Section */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">RSVP:</span>
                <span className="text-sm text-gray-600">
                  {post.eventDetails.rsvp.going.length} going, {post.eventDetails.rsvp.interested.length} interested
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRSVP('going')}
                  className="btn btn-primary btn-sm"
                >
                  Going ({post.eventDetails.rsvp.going.length})
                </button>
                <button
                  onClick={() => handleRSVP('interested')}
                  className="btn btn-secondary btn-sm"
                >
                  Interested ({post.eventDetails.rsvp.interested.length})
                </button>
                <button
                  onClick={() => handleRSVP('notGoing')}
                  className="btn btn-ghost btn-sm"
                >
                  Not Going ({post.eventDetails.rsvp.notGoing.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {post.type === 'lostfound' && post.lostFoundDetails && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">
                  {post.lostFoundDetails.itemType === 'lost' ? 'Lost Item' : 'Found Item'}
                </span>
              </div>
              {post.lostFoundDetails.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  {post.lostFoundDetails.location}
                </div>
              )}
            </div>
          </div>
        )}

        {post.type === 'announcement' && post.announcementDetails && (
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm">
              {post.announcementDetails.department && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Building className="w-4 h-4" />
                  {post.announcementDetails.department}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`badge badge-priority-${post.announcementDetails.priority}`}>
                  {post.announcementDetails.priority} priority
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card-footer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ReactionPicker
              onReactionSelect={handleReaction}
              currentReactions={post.reactionCounts || {}}
              userReaction={getUserReaction()}
            />
            <button
              onClick={() => setShowComments(!showComments)}
              className="btn btn-ghost btn-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {post.commentCount || 0}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {/* Add Comment */}
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex gap-3">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={loading || !newComment.trim()}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-semibold text-xs">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
