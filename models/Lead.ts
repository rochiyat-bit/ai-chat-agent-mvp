import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface LeadAttributes {
  id: string;
  conversation_id: string;
  bot_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  qualification_status: "new" | "contacted" | "qualified" | "converted" | "lost";
  lead_score: number;
  notes: string;
  metadata: object;
  created_at: Date;
  updated_at: Date;
}

interface LeadCreationAttributes
  extends Optional<
    LeadAttributes,
    | "id"
    | "created_at"
    | "updated_at"
    | "phone"
    | "company"
    | "qualification_status"
    | "lead_score"
    | "notes"
    | "metadata"
  > {}

class Lead extends Model<LeadAttributes, LeadCreationAttributes> implements LeadAttributes {
  declare id: string;
  declare conversation_id: string;
  declare bot_id: string;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare company: string | null;
  declare qualification_status: "new" | "contacted" | "qualified" | "converted" | "lost";
  declare lead_score: number;
  declare notes: string;
  declare metadata: object;
  declare created_at: Date;
  declare updated_at: Date;
}

Lead.init(
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
    bot_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Bots",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    qualification_status: {
      type: DataTypes.ENUM("new", "contacted", "qualified", "converted", "lost"),
      defaultValue: "new",
      allowNull: false,
    },
    lead_score: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
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
    tableName: "Leads",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["bot_id"],
      },
      {
        fields: ["qualification_status"],
      },
      {
        fields: ["email"],
      },
    ],
  }
);

export default Lead;
