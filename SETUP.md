# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running (local or cloud)
- Groq API key

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-notes-app
   GROQ_API_KEY=your_groq_api_key_here
   NEXT_PUBLIC_APP_NAME=AI Notes App
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Go to [http://localhost:3000](http://localhost:3000)

## MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/ai-notes-app`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Use your Atlas connection string

## Groq API Key
1. Go to [Groq Console](https://console.groq.com/keys)
2. Create account and get API key
3. Add to `.env.local` file

## Features to Test
- ✅ Create new notes
- ✅ Edit existing notes
- ✅ Delete notes
- ✅ Search notes
- ✅ Filter by tags
- ✅ Archive/unarchive notes
- ✅ Generate AI summaries
- ✅ Responsive design

## Troubleshooting
- Make sure MongoDB is running
- Check your Groq API key is valid
- Ensure all environment variables are set
- Check console for any error messages
