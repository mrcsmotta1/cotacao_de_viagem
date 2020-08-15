import app from "./app";
import bodyParser from "body-parser";

const PORT = process.env.SERVER_PORT || 5000;
const HOST = "0.0.0.0";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello Word!");
});

app.listen(PORT, (HOST) => {
  console.log("Servidor em execução na porta " + PORT);
});
