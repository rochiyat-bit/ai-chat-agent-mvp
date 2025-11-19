import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface AnalyticsEventAttributes {
  id: string;
  bot_id: string;
  event_type: string;
  event_data: object;
  created_at: Date;
}

interface AnalyticsEventCreationAttributes
  extends Optional<AnalyticsEventAttributes, "id" | "created_at" | "event_data"> {}

class AnalyticsEvent
  extends Model<AnalyticsEventAttributes, AnalyticsEventCreationAttributes>
  implements AnalyticsEventAttributes
{
  declare id: string;
  declare bot_id: string;
  declare event_type: string;
  declare event_data: object;
  declare created_at: Date;
}

AnalyticsEvent.init(
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
    event_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    event_data: {
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
    tableName: "AnalyticsEvents",
    timestamps: false,
    indexes: [
      {
        fields: ["bot_id"],
      },
      {
        fields: ["event_type"],
      },
      {
        fields: ["created_at"],
      },
    ],
  }
);

export default AnalyticsEvent;
