import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface MessageAttributes {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  token_count: number;
  metadata: object;
  created_at: Date;
}

interface MessageCreationAttributes
  extends Optional<MessageAttributes, "id" | "created_at" | "token_count" | "metadata"> {}

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  declare id: string;
  declare conversation_id: string;
  declare role: "user" | "assistant" | "system";
  declare content: string;
  declare token_count: number;
  declare metadata: object;
  declare created_at: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Conversations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.ENUM("user", "assistant", "system"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    token_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Messages",
    timestamps: false,
    indexes: [
      {
        fields: ["conversation_id"],
      },
      {
        fields: ["created_at"],
      },
    ],
  }
);

export default Message;
