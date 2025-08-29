// User Types
export interface User {
  userId: string;
  name: string;
  sessionId: string;
}

// Post Types
export type PostType = 'event' | 'lostfound' | 'announcement';

export interface BasePost {
  _id: string;
  type: PostType;
  title: string;
  description: string;
  author: string;
  authorId: string;
  originalPrompt: string;
  createdAt: string;
  updatedAt: string;
  reactions: Reaction[];
  comments: Comment[];
  commentCount: number;
  reactionCounts: { [key: string]: number };
}

export interface EventPost extends BasePost {
  type: 'event';
  eventDetails: {
    location?: string;
    date?: string;
    rsvp: {
      going: RSVPUser[];
      interested: RSVPUser[];
      notGoing: RSVPUser[];
    };
  };
}

export interface LostFoundPost extends BasePost {
  type: 'lostfound';
  lostFoundDetails: {
    itemType: 'lost' | 'found';
    location?: string;
    imageUrl?: string;
    contactInfo?: string;
  };
}

export interface AnnouncementPost extends BasePost {
  type: 'announcement';
  announcementDetails: {
    department?: string;
    attachmentUrl?: string;
    attachmentType?: 'image' | 'pdf';
    priority: 'low' | 'medium' | 'high';
  };
}

export type Post = EventPost | LostFoundPost | AnnouncementPost;

// Interaction Types
export interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  reactions: Reaction[];
  replies: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  reactions: Reaction[];
}

export interface RSVPUser {
  userId: string;
  name: string;
  timestamp: string;
}

// AI Classification Types
export interface AIClassification {
  type: PostType;
  confidence: number;
  title: string;
  description: string;
  extractedData: {
    // Event fields
    location?: string;
    date?: string;
    
    // Lost & Found fields
    itemType?: 'lost' | 'found';
    contactInfo?: string;
    
    // Announcement fields
    department?: string;
    priority?: 'low' | 'medium' | 'high';
    attachmentType?: 'image' | 'pdf';
  };
}

// API Request Types
export interface CreatePostRequest {
  type: PostType;
  title: string;
  description: string;
  author: string;
  authorId: string;
  originalPrompt: string;
  eventDetails?: EventPost['eventDetails'];
  lostFoundDetails?: LostFoundPost['lostFoundDetails'];
  announcementDetails?: AnnouncementPost['announcementDetails'];
}

export interface ClassifyPostRequest {
  prompt: string;
  imageUrl?: string;
}

export interface CreateUserRequest {
  name: string;
  sessionId?: string;
}

export interface AddReactionRequest {
  type: Reaction['type'];
  userId: string;
}

export interface AddCommentRequest {
  content: string;
  author: string;
  authorId: string;
}

export interface RSVPRequest {
  response: 'going' | 'interested' | 'notGoing';
  userId: string;
  name: string;
}

// UI State Types
export interface PostCreationState {
  step: 'input' | 'preview' | 'posting';
  originalPrompt: string;
  classification?: AIClassification;
  isEditing: boolean;
  editedPost?: Partial<CreatePostRequest>;
}

export interface FeedState {
  posts: Post[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
}

export interface UserState {
  user?: User;
  loading: boolean;
  error?: string;
}
