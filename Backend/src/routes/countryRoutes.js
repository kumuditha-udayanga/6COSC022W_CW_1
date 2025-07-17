import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { getCountryDetails } from "../controllers/countryController.js";

const router = express.Router();

router.get('/:country', requireAuth, getCountryDetails);

export default router;