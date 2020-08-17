const express = require("express");
const router = express.Router();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const CotacaoController = require("../app/controllers/CotacaoController");
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "API Cotação de Viagem",
      version: "1.0.0",
      descritpion: "Documentação API de Cotação de Viagem",
      contact: {
        name: "Marcos Pedroso Motta",
        url: "https://www.linkedin.com/in/marcos-pedroso-motta-62662931/",
        email: "mrcsmotta1@gmail.com",
      },
      server: ["http://localhst:5000"],
    },
  },
  apis: ["./src/app/controllers/CotacaoController.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

router.post("/quote/insert", CotacaoController.create);
router.get("/quote/:from/:to", CotacaoController.list);

module.exports = router;
