# AI-Powered Notes App

A modern, full-stack notes application built with Next.js, MongoDB, and OpenAI integration. Create, organize, and summarize your notes with the power of AI.

## Features

### Core CRUD Operations
- ✅ **Create** new notes with rich content
- ✅ **Read** and view all your notes
- ✅ **Update** existing notes
- ✅ **Delete** notes with confirmation

### AI-Powered Features
- 🤖 **AI Summarization** - Generate concise summaries of your notes using OpenAI GPT-3.5-turbo
- 🏷️ **Smart Tagging** - Organize notes with custom tags
- 🔍 **Advanced Search** - Search through titles, content, and tags

### Enhanced User Experience
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- 📦 **Archive System** - Archive notes instead of deleting them
- ⚡ **Real-time Updates** - Instant UI updates after operations
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-notes-app
   GROQ_API_KEY=your_groq_api_key_here
   NEXT_PUBLIC_APP_NAME=AI Notes App
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud service like MongoDB Atlas.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Notes
- `GET /api/notes` - Get all notes (with search, filtering, pagination)
- `POST /api/notes` - Create a new note
- `GET /api/notes/[id]` - Get a specific note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

### AI Features
- `POST /api/notes/[id]/summarize` - Generate AI summary for a note

### Tags
- `GET /api/tags` - Get all unique tags

## Usage

### Creating Notes
1. Click the "New Note" button
2. Enter a title and content
3. Add optional tags
4. Save the note

### AI Summarization
1. Open any note
2. Click the "Summarize" button
3. Wait for the AI to generate a summary
4. The summary will be displayed and saved

### Organizing Notes
- Use tags to categorize your notes
- Search for specific content
- Archive notes you don't need immediately
- Filter by tags or archived status

## Project Structure

```
ai-notes-app/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── notes/     # Note CRUD operations
│   │   │   └── tags/      # Tag operations
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page
│   ├── components/        # React components
│   │   ├── NoteCard.tsx   # Individual note display
│   │   ├── NoteEditor.tsx # Note creation/editing
│   │   ├── SearchBar.tsx  # Search functionality
│   │   └── TagFilter.tsx  # Tag filtering
│   ├── lib/
│   │   └── mongodb.ts     # Database connection
│   └── models/
│       └── Note.ts        # Note data model
├── .env.example          # Environment variables template
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GROQ_API_KEY` | Groq API key for AI features (Llama models) | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |

## Features in Detail

### AI Summarization
- Uses OpenAI's GPT-3.5-turbo model
- Generates 2-3 sentence summaries
- Summaries are saved with the note
- Error handling for API failures

### Search & Filtering
- Full-text search across titles, content, and tags
- Case-insensitive search
- Tag-based filtering
- Archive status filtering
- Real-time search results

### Data Management
- MongoDB with Mongoose for data validation
- Automatic timestamps (created/updated)
- Text indexing for better search performance
- Data validation and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: Make sure to keep your OpenAI API key secure and never commit it to version control. The app includes proper error handling for missing or invalid API keys.