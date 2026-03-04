import mongoose, { Schema, Document } from "mongoose";

/**
 * Progress tracks completed lessons by a student
 */
export interface IProgress extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
}

const ProgressSchema = new Schema<IProgress>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
);

// Ensure one progress document per student per course
ProgressSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

export default mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);