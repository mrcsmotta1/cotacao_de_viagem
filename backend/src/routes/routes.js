import express from "express";

const router = express.Router();

import CotacaoController from "../../app/controllers/CotacaoController";
router.post("/quote/insert", CotacaoController.create);
router.get("/quote/:from/:to", CotacaoController.list);

export default router;
