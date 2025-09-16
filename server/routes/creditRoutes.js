import express from 'express'
import { getPlans, purchasePlan } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const creditRouter = express.Router()

creditRouter.post('/purchase-plan',protect, purchasePlan)
creditRouter.get('/plans', getPlans)  


export default creditRouter;