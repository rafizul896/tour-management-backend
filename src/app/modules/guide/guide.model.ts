import { model, Schema } from "mongoose";
import { GUIDE_STATUS, IGuide } from "./guide.interface";

const guideSchema = new Schema<IGuide>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: [true, "Division is required"],
    },
    nidPhoto: {
      type: String,
      required: [true, "NID photo is required"],
    },
    status: {
      type: String,
      enum: Object.values(GUIDE_STATUS),
      default: GUIDE_STATUS.PENDING,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Guide = model<IGuide>("Guide", guideSchema);
