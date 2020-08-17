const app = require("./app");
const bodyParser = require("body-parser");
const router = require("./routes/routes");

const PORT = process.env.SERVER_PORT || 5000;
const HOST = "0.0.0.0";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(router);
app.listen(PORT, (HOST) => {
  console.log("Servidor em execução na porta " + PORT);
});
