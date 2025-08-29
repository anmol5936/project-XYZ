import React, { useState } from 'react';
import { X, Send, Edit3, Sparkles, Calendar, MapPin, Building, AlertTriangle, Paperclip } from 'lucide-react';
import { User, AIClassification, CreatePostRequest } from '../types';
import { aiApi, postsApi } from '../services/api';
import FileUpload from './FileUpload';

interface PostCreationProps {
  user: User;
  onPostCreated: (post: any) => void;
  onCancel: () => void;
}

const PostCreation: React.FC<PostCreationProps> = ({ user, onPostCreated, onCancel }) => {
  const [step, setStep] = useState<'input' | 'preview' | 'posting'>('input');
  const [prompt, setPrompt] = useState('');
  const [classification, setClassification] = useState<AIClassification | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedDepartment, setEditedDepartment] = useState('');
  const [editedPriority, setEditedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | null>(null);

  const handleClassify = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await aiApi.classifyPost({ prompt: prompt.trim() });
      setClassification(result);
      
      // Initialize editable fields with AI suggestions
      setEditedTitle(result.title);
      setEditedDescription(result.description);
      setEditedLocation(result.extractedData.location || '');
      setEditedDate(result.extractedData.date || '');
      setEditedDepartment(result.extractedData.department || '');
      setEditedPriority(result.extractedData.priority || 'medium');
      
      setStep('preview');
    } catch (error) {
      console.error('Classification failed:', error);
      setError('Failed to classify your post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!classification) return;

    setLoading(true);
    setError(null);

    try {
      const postData: CreatePostRequest = {
        type: classification.type,
        title: editedTitle,
        description: editedDescription,
        author: user.name,
        authorId: user.userId,
        originalPrompt: prompt,
      };

      // Add type-specific data
      if (classification.type === 'event') {
        postData.eventDetails = {
          location: editedLocation,
          date: editedDate ? new Date(editedDate).toISOString() : undefined,
          rsvp: { going: [], interested: [], notGoing: [] }
        };
      } else if (classification.type === 'lostfound') {
        postData.lostFoundDetails = {
          itemType: classification.extractedData.itemType || 'lost',
          location: editedLocation,
          contactInfo: 'Contact via this post',
          imageUrl: attachmentType === 'image' ? attachmentUrl : undefined
        };
      } else if (classification.type === 'announcement') {
        postData.announcementDetails = {
          department: editedDepartment,
          priority: editedPriority,
          attachmentUrl: attachmentUrl || undefined,
          attachmentType: attachmentType || undefined
        };
      }

      const newPost = await postsApi.createPost(postData);
      onPostCreated(newPost);
    } catch (error) {
      console.error('Post creation failed:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'lostfound': return <MapPin className="w-4 h-4" />;
      case 'announcement': return <Building className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getPostTypeBadge = (type: string) => {
    const baseClass = "badge ";
    switch (type) {
      case 'event': return baseClass + "badge-event";
      case 'lostfound': return baseClass + "badge-lostfound";
      case 'announcement': return baseClass + "badge-announcement";
      default: return baseClass + "badge-event";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <p className="text-sm text-gray-500">
                {step === 'input' && 'What would you like to share?'}
                {step === 'preview' && 'Review and edit your post'}
                {step === 'posting' && 'Publishing your post...'}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="btn btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                  {step === 'input' && (
          <div className="space-y-6">
            <div className="form-group">
              <label className="form-label">
                Describe what you want to share
              </label>
              <textarea
                className="form-textarea"
                placeholder="Examples:&#10;• Lost my black wallet near the library yesterday evening&#10;• Workshop on Docker tomorrow at 5pm in CSE Lab&#10;• Important notice from CSE Department about exam schedule"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                disabled={loading}
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2">
                Our AI will automatically determine the post type and extract relevant details
              </p>
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attach Image or PDF (Optional)
              </label>
              <FileUpload
                onFileUploaded={(url, type) => {
                  setAttachmentUrl(url);
                  setAttachmentType(type);
                }}
              />
              <p className="text-sm text-gray-500 mt-2">
                You can attach images for lost & found items or PDF documents for announcements
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        )}

          {step === 'preview' && classification && (
            <div className="space-y-6">
              {/* Classification Result */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  {getPostTypeIcon(classification.type)}
                  <span className={getPostTypeBadge(classification.type)}>
                    {classification.type.replace('lostfound', 'Lost & Found')}
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(classification.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  AI detected this as a <strong>{classification.type}</strong> post. You can edit the details below.
                </p>
              </div>

              {/* Editable Preview */}
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Post Preview</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn btn-ghost btn-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      {isEditing ? 'Done Editing' : 'Edit'}
                    </button>
                  </div>
                </div>

                <div className="card-body space-y-4">
                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                    ) : (
                      <h4 className="text-lg font-semibold text-gray-900">{editedTitle}</h4>
                    )}
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    {isEditing ? (
                      <textarea
                        className="form-textarea"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-700">{editedDescription}</p>
                    )}
                  </div>

                  {/* Type-specific fields */}
                  {classification.type === 'event' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-input"
                            value={editedLocation}
                            onChange={(e) => setEditedLocation(e.target.value)}
                            placeholder="Event location"
                          />
                        ) : (
                          <p className="text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {editedLocation || 'Location not specified'}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Date & Time</label>
                        {isEditing ? (
                          <input
                            type="datetime-local"
                            className="form-input"
                            value={editedDate}
                            onChange={(e) => setEditedDate(e.target.value)}
                          />
                        ) : (
                          <p className="text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {editedDate ? new Date(editedDate).toLocaleString() : 'Date not specified'}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {classification.type === 'lostfound' && (
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-input"
                          value={editedLocation}
                          onChange={(e) => setEditedLocation(e.target.value)}
                          placeholder="Last known location or found location"
                        />
                      ) : (
                        <p className="text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {editedLocation || 'Location not specified'}
                        </p>
                      )}
                    </div>
                  )}

                  {classification.type === 'announcement' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Department</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-input"
                            value={editedDepartment}
                            onChange={(e) => setEditedDepartment(e.target.value)}
                            placeholder="Issuing department"
                          />
                        ) : (
                          <p className="text-gray-700 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {editedDepartment || 'General'}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Priority</label>
                        {isEditing ? (
                          <select
                            className="form-input"
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value as 'low' | 'medium' | 'high')}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        ) : (
                          <span className={`badge badge-priority-${editedPriority}`}>
                            {editedPriority} priority
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            {step === 'preview' && (
              <button
                onClick={() => setStep('input')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>

            {step === 'input' && (
              <button
                onClick={handleClassify}
                className="btn btn-primary"
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Classify Post
                  </>
                )}
              </button>
            )}

            {step === 'preview' && (
              <button
                onClick={handlePost}
                className="btn btn-primary"
                disabled={loading || !editedTitle.trim()}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post to Feed
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;
