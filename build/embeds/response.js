"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.body = exports.loading = exports.warning = exports.info = exports.error = exports.success = void 0;
const globals_1 = require("../utils/globals");
const log_1 = require("../utils/log");
const success = (message) => {
    return {
        color: globals_1.palette.green,
        footer: {
            text: message,
            icon_url: "https://cdn0.iconfinder.com/data/icons/basic-ui-elements-color-round-icon/254000/07-512.png",
        },
    };
};
exports.success = success;
const error = (message) => {
    return {
        color: globals_1.palette.red,
        footer: {
            text: message,
            icon_url: "https://cdn4.iconfinder.com/data/icons/generic-interaction/143/close-x-cross-multiply-delete-cancel-modal-error-no-512.png",
        },
    };
};
exports.error = error;
const info = (message) => {
    return {
        color: globals_1.palette.blue,
        footer: {
            text: message,
            icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaF_vSEeTY3RJ3PilXgTLk52bItDo4mfeOjg&usqp=CAU",
        },
    };
};
exports.info = info;
const warning = (message) => {
    return {
        color: globals_1.palette.yellow,
        footer: {
            text: message,
            icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh_rq04PD0BPCqF5Gg_rDJtXYIHQFL45Za-A&usqp=CAU",
        },
    };
};
exports.warning = warning;
const loading = (message = "Loading...") => {
    return {
        footer: {
            text: message,
            icon_url: "https://cdn.iconscout.com/icon/premium/png-256-thumb/loading-2673387-2217899.png",
        },
    };
};
exports.loading = loading;
const body = (title, message, color = null) => {
    (0, log_1.log)({
        title: title,
        description: message,
        color: color,
    });
    return {
        title: title,
        description: message,
        color: color,
    };
};
exports.body = body;
