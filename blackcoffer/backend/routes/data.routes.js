import { Router } from 'express';
import { importData, queryData, getDistinctValues, filterData } from '../controllers/data.controller.js';

const router = Router();

// POST raw JSON array to import (body should be an array)
router.post('/import', importData);

// GET /api/data - query with filters
router.get('/', queryData);

// GET /api/data/filter - accepts CLI-style query params (intensity_min, topics, end_year, etc.)
router.get('/filter', filterData);

// GET /api/data/meta - distinct values for filters
router.get('/meta', getDistinctValues);

export default router;
