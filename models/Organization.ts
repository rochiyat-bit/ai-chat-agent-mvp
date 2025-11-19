import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface OrganizationAttributes {
  id: string;
  name: string;
  slug: string;
  email: string;
  subscription_tier: "free" | "pro" | "enterprise";
  message_quota: number;
  messages_used: number;
  branding_config: object;
  created_at: Date;
  updated_at: Date;
}

interface OrganizationCreationAttributes
  extends Optional<
    OrganizationAttributes,
    "id" | "created_at" | "updated_at" | "message_quota" | "messages_used" | "branding_config"
  > {}

class Organization
  extends Model<OrganizationAttributes, OrganizationCreationAttributes>
  implements OrganizationAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string;
  declare email: string;
  declare subscription_tier: "free" | "pro" | "enterprise";
  declare message_quota: number;
  declare messages_used: number;
  declare branding_config: object;
  declare created_at: Date;
  declare updated_at: Date;
}

Organization.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    subscription_tier: {
      type: DataTypes.ENUM("free", "pro", "enterprise"),
      defaultValue: "free",
      allowNull: false,
    },
    message_quota: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
      allowNull: false,
    },
    messages_used: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    branding_config: {
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
    tableName: "Organizations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Organization;
