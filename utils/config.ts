import "dotenv/config";
import { Config } from "../interfaces/Config";

let config: Config;

try {
  config = require("../config.json");
} catch (error) {
  config = {
    TOKEN: process.env.TOKEN || "",
    PRUNING: process.env.PRUNING === "true" ? true : false,
    ACTIVITY: "",
    LOCALE: process.env.LOCALE || "en"
  };
}

export { config };
