import {config} from "dotenv";
config();
import MeloettaBot from "./MeloettaBot";
import {connect} from "mongoose";

connect(process.env.MONGO_CONNECT as string);

MeloettaBot.startBot();