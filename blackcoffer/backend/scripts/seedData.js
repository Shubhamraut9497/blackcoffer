import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Data from '../models/Data.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/analytics-dashboard';

async function connect() {
  await mongoose.connect(MONGODB_URI);
}

function readJsonFile(filePath) {
  const full = path.resolve(filePath);
  const raw = fs.readFileSync(full, 'utf-8');
  return JSON.parse(raw);
}

async function seed(filePath) {
  try {
    console.log('Connecting to MongoDB...');
    await connect();
    console.log('Connected');

    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      process.exit(1);
    }

    console.log('Reading JSON file...');
    const data = readJsonFile(filePath);
    if (!Array.isArray(data)) {
      console.error('JSON root must be an array');
      process.exit(1);
    }

    console.log('Clearing existing Data collection (optional)...');
    // optionally clear collection first
    // await Data.deleteMany({});

    const batchSize = 1000;
    let inserted = 0;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize).map((r) => ({
        intensity: r.intensity ?? r.intensity_score ?? null,
        likelihood: r.likelihood ?? null,
        relevance: r.relevance ?? null,
        year: r.year ?? r.start_year ?? null,
        endYear: r.end_year ?? r.endYear ?? null,
        country: r.country ?? null,
        region: r.region ?? null,
        city: r.city ?? r.cityName ?? null,
        topics: Array.isArray(r.topics) ? r.topics : (r.topic ? [r.topic] : []),
        sector: r.sector ?? null,
        pest: r.pest ?? null,
        source: r.source ?? null,
        swot: r.swot ?? null,
        raw: r
      }));

      const res = await Data.insertMany(batch, { ordered: false });
      inserted += res.length;
      console.log(`Inserted ${inserted}/${data.length}`);
    }

    console.log('Seeding completed. Total inserted:', inserted);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

const fileArg = process.argv[2] || './data/jsondata.json';
seed(fileArg);
