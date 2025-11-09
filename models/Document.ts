import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface DocumentAttributes {
  id: string;
  bot_id: string;
  filename: string;
  file_url: string;
  file_size: number;
  file_type: string;
  processing_status: "pending" | "processing" | "completed" | "error";
  chunk_count: number;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}

interface DocumentCreationAttributes
  extends Optional<
    DocumentAttributes,
    | "id"
    | "created_at"
    | "updated_at"
    | "processing_status"
    | "chunk_count"
    | "error_message"
  > {}

class Document
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  declare id: string;
  declare bot_id: string;
  declare filename: string;
  declare file_url: string;
  declare file_size: number;
  declare file_type: string;
  declare processing_status: "pending" | "processing" | "completed" | "error";
  declare chunk_count: number;
  declare error_message: string | null;
  declare created_at: Date;
  declare updated_at: Date;
}

Document.init(
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
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    processing_status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "error"),
      defaultValue: "pending",
      allowNull: false,
    },
    chunk_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "Documents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["bot_id"],
      },
      {
        fields: ["processing_status"],
      },
    ],
  }
);

export default Document;
