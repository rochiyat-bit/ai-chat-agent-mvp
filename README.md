# AI Chat Agent Platform MVP

A production-ready AI chat platform where users can create custom AI agents, train them with knowledge bases, capture leads, and manage conversations. Similar to Outchat.ai.

## 🌟 Features

- **Multi-Tenant Platform**: Organizations and user management
- **Custom AI Agents**: Create and configure AI chatbots with different personalities
- **Knowledge Base**: Upload and train bots with PDF and text documents using RAG (Retrieval Augmented Generation)
- **Real-time Chat**: Streaming chat responses using Server-Sent Events (SSE)
- **Lead Capture**: Automatically capture and qualify leads from conversations
- **Analytics Dashboard**: Track conversations, messages, and bot performance
- **Multi-LLM Support**: OpenRouter integration supporting Claude, GPT-4, Gemini, and more

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Sequelize ORM
- **Vector Database**: pgvector extension for semantic search
- **Authentication**: NextAuth.js v5 with credentials provider
- **AI Provider**: OpenRouter API (multi-LLM support)
- **Embeddings**: OpenAI text-embedding-3-small
- **File Upload**: uploadthing
- **Real-time**: Server-Sent Events (SSE) for streaming

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with pgvector extension
- OpenRouter API key
- OpenAI API key (for embeddings)
- UploadThing account (optional, for file uploads)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-chat-agent-mvp
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Setup PostgreSQL with pgvector

```sql
-- Create database
CREATE DATABASE ai_chat_platform;

-- Connect to the database
\c ai_chat_platform

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_chat_platform

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# AI Providers
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENAI_API_KEY=sk-xxxxx
AGENT_ROUTER_TOKEN=your-agent-router-token-here

# File Upload (optional)
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Initialize the database

The database will be automatically initialized on first run. Tables and relationships will be created using Sequelize.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create your first account

1. Navigate to `/register`
2. Create an account with your organization name
3. Login and create your first bot
4. Upload training documents (PDF or text files)
5. Share the public chat link: `/chat/[botId]`

## 📁 Project Structure

```
ai-chat-agent-mvp/
├── app/
│   ├── (auth)/               # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/          # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── bots/
│   │   ├── leads/
│   │   └── settings/
│   ├── (public)/             # Public pages
│   │   └── chat/[botId]/     # Public chat interface
│   └── api/                  # API routes
│       ├── auth/
│       ├── bots/
│       ├── leads/
│       └── register/
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── chat/                 # Chat components
│   ├── dashboard/            # Dashboard components
│   └── bot/                  # Bot management components
├── lib/
│   ├── ai/                   # AI logic (RAG, embeddings, OpenRouter)
│   ├── auth.ts               # NextAuth configuration
│   └── sequelize.ts          # Database connection
├── models/                   # Sequelize models
│   ├── Organization.ts
│   ├── User.ts
│   ├── Bot.ts
│   ├── Conversation.ts
│   ├── Message.ts
│   ├── Document.ts
│   ├── DocumentChunk.ts
│   ├── Lead.ts
│   └── AnalyticsEvent.ts
├── validators/               # Zod validation schemas
└── types/                    # TypeScript types
```

## 🎯 Key Features Explained

### RAG (Retrieval Augmented Generation)

The platform uses pgvector for semantic search:
1. Documents are chunked into smaller pieces
2. Each chunk is converted to embeddings using OpenAI
3. When a user asks a question, relevant chunks are retrieved
4. Context is injected into the AI prompt for accurate responses

### Streaming Chat

Uses Server-Sent Events (SSE) for real-time streaming:
- Tokens stream as they're generated
- No loading delays for users
- Better user experience

### Lead Capture

Automatically prompts users to share contact information:
- Triggered after meaningful conversation
- Non-intrusive lead capture form
- Leads are tracked and qualified

## 🔐 Security

- Password hashing with bcrypt
- JWT-based session management
- Protected API routes with authentication
- Input validation with Zod
- SQL injection prevention with Sequelize ORM

## 📊 Database Schema

### Core Tables

- **Organizations**: Multi-tenant organization management
- **Users**: User accounts with role-based access
- **Bots**: AI agent configurations
- **Conversations**: Chat sessions
- **Messages**: Individual chat messages
- **Documents**: Uploaded training files
- **DocumentChunks**: Vector embeddings for RAG
- **Leads**: Captured lead information
- **AnalyticsEvents**: Usage tracking

## 🚢 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure environment variables in Vercel dashboard

4. Setup PostgreSQL database:
   - Use Supabase, Railway, or Neon
   - Enable pgvector extension
   - Update DATABASE_URL

## 🔧 Configuration

### Supported AI Providers

**OpenRouter** (Multi-provider access)
- `anthropic/claude-3.5-sonnet` (default)
- `anthropic/claude-3-haiku`
- `openai/gpt-4-turbo`
- `openai/gpt-3.5-turbo`
- `google/gemini-pro`
- `meta-llama/llama-3.1-70b-instruct`

**Agent Router** (https://agentrouter.org)
- `gpt-4o`
- `gpt-4o-mini`
- `claude-3-5-sonnet-20241022`
- `claude-3-5-haiku-20241022`
- `gemini-2.0-flash-exp`
- `gemini-1.5-pro`
- `llama-3.3-70b-versatile`
- And more models...

### Model Parameters

- **Temperature**: 0-2 (creativity level)
- **Max Tokens**: 100-4000 (response length)
- **System Prompt**: Custom personality and behavior

## 📝 API Documentation

### Authentication

**POST** `/api/register`
- Create new user and organization

**POST** `/api/auth/[...nextauth]`
- NextAuth authentication endpoints

### Bots

**GET** `/api/bots`
- List all bots for organization

**POST** `/api/bots`
- Create new bot

**GET** `/api/bots/[id]`
- Get bot details

**PUT** `/api/bots/[id]`
- Update bot configuration

**DELETE** `/api/bots/[id]`
- Delete bot

### Chat

**POST** `/api/bots/[id]/chat`
- Send message and stream response (SSE)

### Documents

**GET** `/api/bots/[id]/documents`
- List bot documents

**POST** `/api/bots/[id]/documents`
- Upload and process document

**DELETE** `/api/bots/[id]/documents?documentId=xxx`
- Delete document

### Leads

**GET** `/api/leads`
- List all leads

**POST** `/api/leads`
- Create lead from conversation

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U user -d ai_chat_platform

# Check if pgvector is installed
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### API Key Issues

- Verify OpenRouter API key is valid
- Check OpenAI API key has embeddings access
- Ensure environment variables are loaded

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📈 Roadmap

- [ ] WhatsApp integration
- [ ] Slack integration
- [ ] Advanced analytics and funnel analysis
- [ ] Custom domains per bot
- [ ] Team collaboration features
- [ ] API access for developers
- [ ] Subscription billing (Stripe)
- [ ] CRM integrations (webhooks)
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js, Sequelize, and OpenRouter
- UI components from shadcn/ui
- Vector search powered by pgvector

---

**Need help?** Open an issue or contact support.
