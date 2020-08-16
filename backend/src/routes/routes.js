import express from "express";

const router = express.Router();

import CotacaoController from "../../app/controllers/CotacaoController";
router.post("/quote/insert", CotacaoController.create);
// router.put("/quote/:partida/:rota", CotacaoController.list);

export default router;
