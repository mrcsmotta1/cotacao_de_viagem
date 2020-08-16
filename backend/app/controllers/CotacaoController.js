import _ from "lodash";
import fs from "fs";
import neatCsv from "neat-csv";

const pathFile = "./csv/routes.csv";

export default {
  async create(req, res) {
    try {
      const from = req.body.from;
      const to = req.body.to;
      const price = req.body.price;

      if (from == undefined || to == undefined || price == undefined) {
        return res
          .status(400)
          .json({ message: "Incomplete data to save travel quote" });
      } else {
        const dataExist = [
          {
            from: from,
            to: to,
            price: price,
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