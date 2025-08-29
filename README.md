# NIT Rourkela Campus Feed - AI Hackathon Challenge

A campus feed application for NIT Rourkela that supports AI-powered post creation with three post types: Events, Lost & Found, and Official Announcements.

## Features

### Core Features
- **Single Textbox AI Classification**: Students type naturally, AI determines post type and extracts structured data
- **Three Post Types**:
  - **Event Posts**: Workshops, college fest, club activities with RSVP system
  - **Lost & Found Posts**: Report lost items or announce found items
  - **Official Announcements**: Department notices, timetables, campus updates
- **Interactive Features**: Comments with threaded replies, reactions, RSVP system
- **Cookie-based Sessions**: No login required, seamless user experience

### AI Features
- Smart post classification using OpenAI GPT-4o-mini
- Automatic data extraction (dates, locations, departments, etc.)
- Editable preview before posting
- Natural language processing for campus-specific content

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, OpenAI API
- **Frontend**: React, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **AI**: OpenAI GPT-4o-mini for classification and enhancement

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anmol5936/project-XYZ.git
   cd project-XYZ
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   NODE_ENV=development
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both backend and frontend)
   npm run dev
   
   # Or run separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `POST /api/posts/:id/reactions` - Add reaction
- `POST /api/posts/:id/comments` - Add comment
- `POST /api/posts/:id/rsvp` - RSVP to event

### AI Classification
- `POST /api/ai/classify-post` - Classify user input and extract data
- `POST /api/ai/enhance-post` - Get suggestions for post improvement

### User Management
- `POST /api/users/session` - Create/get user session
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile

## Project Structure

```
├── server.js              # Express server entry point
├── config.js              # Configuration management
├── models/
│   ├── Post.js            # Post schema (Event, LostFound, Announcement)
│   └── User.js            # User schema
├── routes/
│   ├── posts.js           # Post-related routes
│   ├── ai.js              # AI classification routes
│   └── users.js           # User management routes
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
└── package.json
```

## Hackathon Requirements Compliance

✅ **Three Post Types**: Event, Lost & Found, Announcement with required fields  
✅ **Single Textbox Input**: Natural language processing with AI classification  
✅ **Editable Preview**: Students can modify AI-generated post before publishing  
✅ **Comments & Reactions**: Threaded discussions with emoji reactions  
✅ **No-Login Policy**: Cookie-based sessions, no authentication required  
✅ **AI Integration**: OpenAI API for smart post creation  
✅ **Clean Feed**: Structured, uncluttered display of posts  
✅ **RSVP System**: Going/Interested/Not Going for events  

## Development Guidelines

- **Team Collaboration**: Clear Git commit messages showing individual contributions
- **Code Quality**: Modular, readable code with proper error handling
- **AI Usage**: Leveraged AI for development assistance and core features
- **Mobile Responsive**: Works on both web and mobile devices

## Contributing

This project was developed for the NIT Rourkela AI Hackathon Challenge. Each team member's contributions are tracked through Git commits.

## License

MIT License - See LICENSE file for details
# project-XYZ
