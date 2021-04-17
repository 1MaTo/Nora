"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueFromArray = void 0;
const uniqueFromArray = (array) => array.filter((v, i, a) => a.indexOf(v) === i);
exports.uniqueFromArray = uniqueFromArray;
