"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeQuery = exports.dbQuery = void 0;
const mysql_1 = __importDefault(require("mysql"));
const util_1 = __importDefault(require("util"));
const auth_json_1 = require("../auth.json");
const log_1 = require("../utils/log");
const db = mysql_1.default.createConnection(auth_json_1.dbConnection);
const connectToDb = () => {
    try {
        db.connect();
    }
    catch (error) {
        (0, log_1.log)(error);
        setTimeout(() => connectToDb(), 5000);
    }
};
connectToDb();
db.on("error", (error) => {
    (0, log_1.log)(error);
    connectToDb();
});
const dbQuery = (sql) => {
    return util_1.default.promisify(db.query).call(db, sql);
};
exports.dbQuery = dbQuery;
const makeQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, exports.dbQuery)(query);
        if (!result.length)
            return null;
        return result;
    }
    catch (error) {
        (0, log_1.log)(error);
        return null;
    }
});
exports.makeQuery = makeQuery;
