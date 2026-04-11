import mongoose from "mongoose";
import type { Category } from "../../../domain/entities/Category.js";

const categorySchema = new mongoose.Schema<Category>(
  {
    id: { type: String },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    type: { type: String, enum: ['Traumato-Ortopédica', 'Esportiva', 'Neurofuncional', 'Geriatria', 'Pediatria', 'Outros', 'RPG'], required: false },
    active: { type: Boolean, default: true },
    duration: { type: Number, required: false },
    settingsId: { type: String },
  },
  { timestamps: true }
);

// @ts-ignore
categorySchema.pre('save', function() {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const CategoryModel = mongoose.model<Category>("Category", categorySchema);

export default CategoryModel;
