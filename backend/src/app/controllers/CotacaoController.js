const _ = require("lodash");
const fs = require("fs");
const neatCsv = require("neat-csv");

const pathFile = require("path").resolve(__dirname, "../../csv/routes.csv");
// console.log(process.cwd())
module.exports = {
  async create(req, res) {
    try {
      const from = req.body.from.toUpperCase();
      const to = req.body.to.toUpperCase();
      const price = req.body.price;

      if (from == undefined || to == undefined || price == undefined) {
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
            ],
          });

          const dataInsert = [
            {
              id: numberLinesCount >= 1 ? numberLinesCount + 1 : 1,
              from: from,
              to: to,
              price: price,
            },
          ];

          csvWriter
            .writeRecords(dataInsert)
            .then(() => console.log("The CSV file was written successfully"));
          res.status(200).json({ message: "Create" });
        });
      }
    } catch (error) {
      return res.status(415).json({ error: "Create failed" });
    }
  },

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
            console.log("x", checks);
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
      return res.status(415).json({ error: "Create failed" });
    }
  },
};

function checkIfThereIs(arrayCsv, arrayInsert) {
  let fromInsert = arrayInsert[0].from;
  let toInsert = arrayInsert[0].to;
  let priceInsert = arrayInsert[0].price;

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
