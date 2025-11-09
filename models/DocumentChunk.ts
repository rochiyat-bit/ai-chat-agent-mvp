import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface DocumentChunkAttributes {
  id: string;
  document_id: string;
  content: string;
  embedding: number[];
  chunk_index: number;
  metadata: object;
  created_at: Date;
}

interface DocumentChunkCreationAttributes
  extends Optional<DocumentChunkAttributes, "id" | "created_at" | "metadata"> {}

class DocumentChunk
  extends Model<DocumentChunkAttributes, DocumentChunkCreationAttributes>
  implements DocumentChunkAttributes
{
  declare id: string;
  declare document_id: string;
  declare content: string;
  declare embedding: number[];
  declare chunk_index: number;
  declare metadata: object;
  declare created_at: Date;
}

DocumentChunk.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    document_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Documents",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    embedding: {
      type: "vector(1536)", // OpenAI text-embedding-3-small dimension
      allowNull: false,
    },
    chunk_index: {
      type: DataTypes.INTEGER,
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
    tableName: "DocumentChunks",
    timestamps: false,
    indexes: [
      {
        fields: ["document_id"],
      },
      {
        name: "document_chunks_embedding_idx",
        fields: ["embedding"],
        using: "ivfflat",
        // @ts-ignore - Sequelize doesn't have types for pgvector operators
        operator: "vector_cosine_ops",
      },
    ],
  }
);

export default DocumentChunk;
