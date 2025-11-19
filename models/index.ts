import { sequelize } from "@/lib/sequelize";
import Organization from "./Organization";
import User from "./User";
import Bot from "./Bot";
import Conversation from "./Conversation";
import Message from "./Message";
import Document from "./Document";
import DocumentChunk from "./DocumentChunk";
import Lead from "./Lead";
import AnalyticsEvent from "./AnalyticsEvent";

// Define relationships

// Organization has many Users
Organization.hasMany(User, {
  foreignKey: "organization_id",
  as: "users",
});
User.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

// Organization has many Bots
Organization.hasMany(Bot, {
  foreignKey: "organization_id",
  as: "bots",
});
Bot.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

// Bot has many Conversations
Bot.hasMany(Conversation, {
  foreignKey: "bot_id",
  as: "conversations",
});
Conversation.belongsTo(Bot, {
  foreignKey: "bot_id",
  as: "bot",
});

// Conversation has many Messages
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  as: "conversation",
});

// Bot has many Documents
Bot.hasMany(Document, {
  foreignKey: "bot_id",
  as: "documents",
});
Document.belongsTo(Bot, {
  foreignKey: "bot_id",
  as: "bot",
});

// Document has many DocumentChunks
Document.hasMany(DocumentChunk, {
  foreignKey: "document_id",
  as: "chunks",
});
DocumentChunk.belongsTo(Document, {
  foreignKey: "document_id",
  as: "document",
});

// Conversation has one Lead
Conversation.hasOne(Lead, {
  foreignKey: "conversation_id",
  as: "lead",
});
Lead.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  as: "conversation",
});

// Bot has many Leads
Bot.hasMany(Lead, {
  foreignKey: "bot_id",
  as: "leads",
});
Lead.belongsTo(Bot, {
  foreignKey: "bot_id",
  as: "bot",
});

// Bot has many AnalyticsEvents
Bot.hasMany(AnalyticsEvent, {
  foreignKey: "bot_id",
  as: "analytics_events",
});
AnalyticsEvent.belongsTo(Bot, {
  foreignKey: "bot_id",
  as: "bot",
});

// Initialize database
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Create pgvector extension if not exists
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');
    console.log("✅ pgvector extension enabled.");

    // Sync models (use { force: true } in development to recreate tables)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Database models synchronized.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
}

export {
  sequelize,
  Organization,
  User,
  Bot,
  Conversation,
  Message,
  Document,
  DocumentChunk,
  Lead,
  AnalyticsEvent,
};
