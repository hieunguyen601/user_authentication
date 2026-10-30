import dotenv from "dotenv";
import app from "./app.js";



dotenv.config();
app.use(express.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running on server", port);
});
