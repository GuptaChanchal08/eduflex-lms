import mongoose, { Schema, Document } from "mongoose";

/**
 * Lesson belongs to a Section
 */
export interface ILesson extends Document {
  title: string;
  section: mongoose.Types.ObjectId;
  contentType: "video" | "text";
  contentUrl?: string;
  textContent?: string;
  order: number;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["video", "text"],
      required: true,
    },
    contentUrl: String,
    textContent: String,
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson ||
  mongoose.model<ILesson>("Lesson", LessonSchema);