import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
  intensity: { type: Number },
  likelihood: { type: Number },
  relevance: { type: Number },
  year: { type: Number },
  endYear: { type: Number },
  country: { type: String },
  region: { type: String },
  city: { type: String },
  topics: { type: [String], default: [] },
  sector: { type: String },
  pest: { type: String },
  source: { type: String },
  swot: { type: String },
  // keep original record for reference
  raw: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Data = mongoose.model('Data', DataSchema);

export default Data;
