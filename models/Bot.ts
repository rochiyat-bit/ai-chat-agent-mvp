import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface BotAttributes {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  avatar_url: string | null;
  knowledge_base_status: "empty" | "processing" | "ready" | "error";
  total_conversations: number;
  total_messages: number;
  created_at: Date;
  updated_at: Date;
}

interface BotCreationAttributes
  extends Optional<
    BotAttributes,
    | "id"
    | "created_at"
    | "updated_at"
    | "description"
    | "temperature"
    | "max_tokens"
    | "is_active"
    | "avatar_url"
    | "knowledge_base_status"
    | "total_conversations"
    | "total_messages"
  > {}

class Bot extends Model<BotAttributes, BotCreationAttributes> implements BotAttributes {
  declare id: string;
  declare organization_id: string;
  declare name: string;
  declare description: string | null;
  declare system_prompt: string;
  declare model: string;
  declare temperature: number;
  declare max_tokens: number;
  declare is_active: boolean;
  declare avatar_url: string | null;
  declare knowledge_base_status: "empty" | "processing" | "ready" | "error";
  declare total_conversations: number;
  declare total_messages: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Bot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Organizations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    system_prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "anthropic/claude-3.5-sonnet",
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.7,
      validate: {
        min: 0,
        max: 2,
      },
    },
    max_tokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
      validate: {
        min: 100,
        max: 4000,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    knowledge_base_status: {
      type: DataTypes.ENUM("empty", "processing", "ready", "error"),
      defaultValue: "empty",
      allowNull: false,
    },
    total_conversations: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    total_messages: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Bots",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["organization_id"],
      },
    ],
  }
);

export default Bot;
