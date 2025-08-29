import React, { useState, useEffect } from 'react';
import { User, Post, PostCreationState } from './types';
import { userApi, postsApi } from './services/api';
import Header from './components/Header';
import PostCreation from './components/PostCreation';
import Feed from './components/Feed';
import UserSetup from './components/UserSetup';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostCreation, setShowPostCreation] = useState(false);

  // Initialize user session on app load
  useEffect(() => {
    initializeUser();
    loadPosts();
  }, []);

  const initializeUser = async () => {
    try {
      // Try to get existing user session
      const currentUser = await userApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // No existing session, user needs to set up
      console.log('No existing session found');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const feedPosts = await postsApi.getAllPosts();
      setPosts(feedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleUserSetup = async (name: string) => {
    try {
      const newUser = await userApi.createSession({ name });
      setUser(newUser);
    } catch (error) {
      console.error('Failed to create user session:', error);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setShowPostCreation(false);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading NIT Rourkela Feed...</p>
      </div>
    );
  }

  if (!user) {
    return <UserSetup onUserSetup={handleUserSetup} />;
  }

  return (
    <div className="App">
      <Header 
        user={user} 
        onCreatePost={() => setShowPostCreation(true)}
        onRefresh={loadPosts}
      />
      
      <main className="app-main">
        {showPostCreation && (
          <PostCreation
            user={user}
            onPostCreated={handlePostCreated}
            onCancel={() => setShowPostCreation(false)}
          />
        )}
        
        <Feed 
          posts={posts}
          currentUser={user}
          onPostUpdated={handlePostUpdated}
          onCreatePost={() => setShowPostCreation(true)}
        />
      </main>
    </div>
  );
}

export default App;
