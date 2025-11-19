import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface ConversationAttributes {
  id: string;
  bot_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  status: "active" | "archived" | "qualified";
  lead_score: number;
  metadata: object;
  last_message_at: Date;
  created_at: Date;
  updated_at: Date;
}

interface ConversationCreationAttributes
  extends Optional<
    ConversationAttributes,
    | "id"
    | "created_at"
    | "updated_at"
    | "visitor_name"
    | "visitor_email"
    | "visitor_phone"
    | "status"
    | "lead_score"
    | "metadata"
    | "last_message_at"
  > {}

class Conversation
  extends Model<ConversationAttributes, ConversationCreationAttributes>
  implements ConversationAttributes
{
  declare id: string;
  declare bot_id: string;
  declare visitor_name: string | null;
  declare visitor_email: string | null;
  declare visitor_phone: string | null;
  declare status: "active" | "archived" | "qualified";
  declare lead_score: number;
  declare metadata: object;
  declare last_message_at: Date;
  declare created_at: Date;
  declare updated_at: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bot_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Bots",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    visitor_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    visitor_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    visitor_phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "archived", "qualified"),
      defaultValue: "active",
      allowNull: false,
    },
    lead_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    last_message_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    tableName: "Conversations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["bot_id"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["visitor_email"],
      },
    ],
  }
);

export default Conversation;
