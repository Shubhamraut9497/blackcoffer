import Data from '../models/Data.model.js';

// Bulk import JSON array in request body
export const importData = async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Request body must be a non-empty array' });
    }

    // Normalize each record to match schema
    const docs = records.map((r) => ({
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

    const inserted = await Data.insertMany(docs, { ordered: false });
    res.status(201).json({ success: true, inserted: inserted.length });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ success: false, message: 'Error importing data', error: error.message });
  }
};

// Query data with filters and pagination
export const queryData = async (req, res) => {
  try {
    const q = {};

    const {
      endYear,
      topics,
      sector,
      region,
      pest,
      source,
      swot,
      country,
      city,
      intensityMin,
      intensityMax,
      likelihoodMin,
      likelihoodMax,
      relevanceMin,
      relevanceMax,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortDir = 'desc'
    } = req.query;

    if (endYear) {
      // treat endYear as upper bound
      q.endYear = { $lte: Number(endYear) };
    }

    if (topics) {
      const t = String(topics).split(',').map((s) => s.trim());
      q.topics = { $in: t };
    }

    if (sector) q.sector = String(sector);
    if (region) q.region = String(region);
    if (pest) q.pest = String(pest);
    if (source) q.source = String(source);
    if (swot) q.swot = String(swot);
    if (country) q.country = String(country);
    if (city) q.city = String(city);

    if (intensityMin || intensityMax) {
      q.intensity = {};
      if (intensityMin) q.intensity.$gte = Number(intensityMin);
      if (intensityMax) q.intensity.$lte = Number(intensityMax);
    }

    if (likelihoodMin || likelihoodMax) {
      q.likelihood = {};
      if (likelihoodMin) q.likelihood.$gte = Number(likelihoodMin);
      if (likelihoodMax) q.likelihood.$lte = Number(likelihoodMax);
    }

    if (relevanceMin || relevanceMax) {
      q.relevance = {};
      if (relevanceMin) q.relevance.$gte = Number(relevanceMin);
      if (relevanceMax) q.relevance.$lte = Number(relevanceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortDir === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      Data.find(q).sort(sort).skip(skip).limit(Number(limit)),
      Data.countDocuments(q)
    ]);

    res.json({ success: true, total, page: Number(page), limit: Number(limit), items });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ success: false, message: 'Error querying data', error: error.message });
  }
};

// Return distinct values for filter controls
export const getDistinctValues = async (req, res) => {
  try {
    const fields = ['topics', 'sector', 'region', 'pest', 'source', 'swot', 'country', 'city'];
    const result = {};
    await Promise.all(fields.map(async (f) => {
      if (f === 'topics') {
        result[f] = await Data.distinct('topics');
      } else {
        result[f] = await Data.distinct(f);
      }
    }));
    res.json({ success: true, values: result });
  } catch (error) {
    console.error('Distinct values error:', error);
    res.status(500).json({ success: false, message: 'Error fetching distinct values', error: error.message });
  }
};

// HTTP filter endpoint that mirrors the CLI flags (intensity_min, intensity_max, end_year, topics, sectors, etc.)
export const filterData = async (req, res) => {
  try {
    const q = {};
    const {
      end_year,
      topics,
      sectors,
      sector,
      region,
      pest,
      source,
      swot,
      country,
      city,
      intensity_min,
      intensity_max,
      likelihood_min,
      likelihood_max,
      relevance_min,
      relevance_max,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortDir = 'desc'
    } = req.query;

    if (end_year) {
      // treat as upper bound when numeric
      const ey = Number(end_year);
      if (!Number.isNaN(ey)) {
        q.endYear = { $lte: ey };
      } else {
        q.endYear = end_year;
      }
    }

    if (topics) {
      const t = String(topics).split(',').map((s) => s.trim());
      q.topics = { $in: t };
    }

    if (sectors) {
      const s = String(sectors).split(',').map((x) => x.trim());
      q.sector = { $in: s };
    }

    if (sector) q.sector = String(sector);
    if (region) q.region = String(region);
    if (pest) q.pest = String(pest);
    if (source) q.source = String(source);
    if (swot) q.swot = String(swot);
    if (country) q.country = String(country);
    if (city) q.city = String(city);

    if (intensity_min || intensity_max) {
      q.intensity = {};
      if (intensity_min) q.intensity.$gte = Number(intensity_min);
      if (intensity_max) q.intensity.$lte = Number(intensity_max);
    }

    if (likelihood_min || likelihood_max) {
      q.likelihood = {};
      if (likelihood_min) q.likelihood.$gte = Number(likelihood_min);
      if (likelihood_max) q.likelihood.$lte = Number(likelihood_max);
    }

    if (relevance_min || relevance_max) {
      q.relevance = {};
      if (relevance_min) q.relevance.$gte = Number(relevance_min);
      if (relevance_max) q.relevance.$lte = Number(relevance_max);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortDir === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      Data.find(q).sort(sort).skip(skip).limit(Number(limit)),
      Data.countDocuments(q)
    ]);

    res.json({ success: true, total, page: Number(page), limit: Number(limit), items });
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ success: false, message: 'Error filtering data', error: error.message });
  }
};
