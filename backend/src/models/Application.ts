import { Schema, model, Types } from 'mongoose';

const ApplicationSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    empresa: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default model('Application', ApplicationSchema);
