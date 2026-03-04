import mongoose, { Schema, Document } from "mongoose";

/**
 * Section belongs to a Course
 */
export interface ISection extends Document {
  title: string;
  course: mongoose.Types.ObjectId;
  order: number;
}

const SectionSchema = new Schema<ISection>(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Section ||
  mongoose.model<ISection>("Section", SectionSchema);