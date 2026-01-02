// routes/promotionRoutes.js
import express from "express";
import Promotion from "../models/Promotion.js";
import {
applyPromotion,removePromotion,getActivePromotions,updatePromotion,getProductsWithPromo
  

} from "../controllers/promotionController.js";

const router = express.Router();

// Get all active promotions
router.get("/", getActivePromotions);

 router.get("/promos", getProductsWithPromo);     
router.post("/apply", applyPromotion);   
router.delete("/:id", removePromotion);
router.put("/:id", updatePromotion);


export default router;

