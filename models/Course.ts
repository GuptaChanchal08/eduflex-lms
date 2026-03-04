import mongoose, { Schema, Document } from "mongoose";

/**
 * Course Interface (TypeScript)
 */
export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  instructor: mongoose.Types.ObjectId;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course Schema
 */
const CourseSchema = new Schema<ICourse>(
  {
    // Course title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Course description
    description: {
      type: String,
      required: true,
    },

    // Course price
    price: {
      type: Number,
      required: true,
      default: 0,
    },

    // Instructor who created the course
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Course status
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);