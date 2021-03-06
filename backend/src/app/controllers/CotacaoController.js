const _ = require("lodash");
const fs = require("fs");
const neatCsv = require("neat-csv");

const pathFile = require("path").resolve(__dirname, "../../csv/routes.csv");

module.exports = {
  /**
   * @swagger
   * /quote/insert:
   *  post:
   *    tags:
   *    - Cotação
   *    summary: 'Insere uma nova Cotação de Viagem'
   *    description: 'Insere uma nova Cotação de Viagem'
   *    produces:
   *    - application/json
   *    parameters:
   *    - in: body
   *      name: body
   *      description: Insere uma nova Cotação de Viagem
   *      required: true
   *      schema:
   *        type: object
   *        properties:
   *          from:
   *             type: string
   *             example: "BRC"
   *          to:
   *             type: string
   *             example: "CA"
   *          price:
   *             type: integer
   *             format: integer
   *             example: 10
   *    responses:
   *       201:
   *         description: "Create"
   *         schema:
   *          $ref: "#/definitions/Insere_cotacao"
   *       400:
   *          description: "Incomplete data to save travel quote"
   *       409:
   *          description: "Duplicate data"
   *       415:
   *          description: "Create failed"
   * definitions:
   *    Insere_cotacao:
   *       type: object
   *       example:
   *         doc:
   *          from: BRC
   *          to: CA
   *          price: 10
   *       properties:
   *         from:
   *            type: string
   *         to:
   *            type: string
   *         price:
   *            type: integer
   *       xml:
   *          name: 'Cotacao'
   */
  async create(req, res) {
    try {
      const from = req.body.from.toUpperCase();
      const to = req.body.to.toUpperCase();
      const price = req.body.price;

      if (!from || !to || !price) {
        return res
          .status(400)
          .json({ message: "Incomplete data to save travel quote" });
      } else {
        const dataExist = [
          {
            From: from,
            To: to,
            Price: price,
          },
        ];

        fs.readFile(pathFile, async (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const numRow = await neatCsv(data);
          const numberLinesCount = Object.keys(numRow).length;

          if (numberLinesCount >= 1) {
            const checks = checkIfThereIs(numRow, dataExist);

            if (checks.length > 0) {
              return res.status(409).json({ message: "Duplicate data" });
            }
          }

          const createCsvWriter = require("csv-writer").createObjectCsvWriter;
          const csvWriter = createCsvWriter({
            path: pathFile,
            append: numberLinesCount >= 1 ? true : false,
            header: [
              { id: "id", title: "ID" },
              { id: "from", title: "From" },
              { id: "to", title: "To" },
              { id: "price", title: "Price" },
              { id: "date", title: "Date" },
            ],
          });

          const dataInsert = [
            {
              id: numberLinesCount >= 1 ? numberLinesCount + 1 : 1,
              from: from,
              to: to,
              price: price,
              date: dateNow(),
            },
          ];

          csvWriter
            .writeRecords(dataInsert)
            .then(() => console.log("The CSV file was written successfully"));
          res.status(201).json({ message: "Create" });
        });
      }
    } catch (error) {
      return res.status(415).json({ error: "Create failed" });
    }
  },

  /**
   * @swagger
   * /quote/{from}/{to}:
   *  get:
   *    tags:
   *    - Peças
   *    summary: 'Exibe uma Cotação de Viagem cadastrada'
   *    description: 'Exibe uma Cotação de Viagem cadastrada'
   *    produces:
   *    - application/json
   *    parameters:
   *    - in: path
   *      name: from
   *      format: string
   *      schema:
   *        type: string
   *      required: true
   *      description: Partida da Viagem BRC
   *    - in: path
   *      name: to
   *      format: string
   *      schema:
   *        type: string
   *      required: true
   *      description: Destino da Viagem CA
   *    responses:
   *       200:
   *         description:
   *         schema:
   *          $ref: '#/definitions/Exibe_cotacao'
   *       204:
   *          description: "There are no registered data"
   *       400:
   *          description: "Incomplete data to seek travel budget"
   *       415:
   *          description: "Select failed"
   * definitions:
   *    Exibe_cotacao:
   *       type: object
   *       example:
   *         route: "BRC,CA"
   *         price: 10
   *       properties:
   *         route:
   *            type: string
   *         price:
   *            type: number
   *       xml:
   *          name: 'Cotacao'
   *
   */
  async list(req, res) {
    const from = req.params.from.toUpperCase();
    const to = req.params.to.toUpperCase();

    try {
      if (!isNaN(to) || !isNaN(from)) {
        return res
          .status(400)
          .json({ message: "Incomplete data to seek travel budget" });
      } else {
        const dataExist = [
          {
            from: from,
            to: to,
          },
        ];

        fs.readFile(pathFile, async (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const numRow = await neatCsv(data);
          const numberLinesCount = Object.keys(numRow).length;

          if (numberLinesCount >= 1) {
            const checks = checkForSearch(numRow, dataExist);
            const checksMin = checkForMin(checks);

            if (checks.length > 0) {
              return res.status(200).json({
                route: `${from},${to}`,
                price: checksMin.Price,
              });
            } else {
              return res
                .status(204)
                .json({ message: "There are no registered data" });
            }
          } else {
            return res
              .status(204)
              .json({ message: "There are no registered data" });
          }
        });
      }
    } catch (error) {
      return res.status(415).json({ error: "Select failed" });
    }
  },
};

function checkIfThereIs(arrayCsv, arrayInsert) {
  let fromInsert = arrayInsert[0].From;
  let toInsert = arrayInsert[0].To;
  let priceInsert = arrayInsert[0].Price;

  let exist = _.filter(arrayCsv, {
    From: `${fromInsert}`,
    To: `${toInsert}`,
    Price: `${priceInsert}`,
  });

  return exist;
}

function checkForSearch(arrayCsv, arrayInsert) {
  let fromInsert = arrayInsert[0].from;
  let toInsert = arrayInsert[0].to;
  arrayWitshString(arrayCsv);

  let exist = _.filter(arrayCsv, {
    From: `${fromInsert}`,
    To: `${toInsert}`,
  });

  return exist;
}

function checkForMin(arraySelect) {
  arrayWitshString(arraySelect);

  let exist = _.minBy(arraySelect, "Price");

  return exist;
}

const arrayWitshString = (arrayValueString) => {
  arrayValueString.map((d) => {
    d.Price = parseInt(d.Price);
    return d;
  });
};

const dateNow = () => {
  const date = new Date();
  const dateToBr =
    ("0" + date.getDate()).substr(-2) +
    "/" +
    ("0" + (date.getMonth() + 1)).substr(-2) +
    "/" +
    date.getFullYear();

  return dateToBr;
};
