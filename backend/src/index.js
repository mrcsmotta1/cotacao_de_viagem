import app from "./app";
import bodyParser from "body-parser";
import routes from "./routes/routes";

const PORT = process.env.SERVER_PORT || 5000;
const HOST = "0.0.0.0";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, (HOST) => {
  console.log("Servidor em execução na porta " + PORT);
});
