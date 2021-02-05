import { palette } from "../utils/globals";
import { log } from "../utils/log";

export const success = (message: string) => {
  return {
    color: palette.green,
    footer: {
      text: message,
      icon_url:
        "https://cdn0.iconfinder.com/data/icons/basic-ui-elements-color-round-icon/254000/07-512.png",
    },
  };
};

export const error = (message: string) => {
  return {
    color: palette.red,
    footer: {
      text: message,
      icon_url:
        "https://cdn4.iconfinder.com/data/icons/generic-interaction/143/close-x-cross-multiply-delete-cancel-modal-error-no-512.png",
    },
  };
};

export const info = (message: string) => {
  return {
    color: palette.blue,
    footer: {
      text: message,
      icon_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaF_vSEeTY3RJ3PilXgTLk52bItDo4mfeOjg&usqp=CAU",
    },
  };
};

export const warning = (message: string) => {
  return {
    color: palette.yellow,
    footer: {
      text: message,
      icon_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh_rq04PD0BPCqF5Gg_rDJtXYIHQFL45Za-A&usqp=CAU",
    },
  };
};

export const loading = (message: string = "Loading...") => {
  return {
    footer: {
      text: message,
      icon_url:
        "https://cdn.iconscout.com/icon/premium/png-256-thumb/loading-2673387-2217899.png",
    },
  };
};

export const body = (title: string, message: string, color: string = null) => {
  log({
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
