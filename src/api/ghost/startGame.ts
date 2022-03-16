import { ghostCommandsMarks } from "../../utils/globals";
import {
  sendCommand,
  whaitForCommandResult,
} from "../../utils/requestToGuiServer";

export const startGame = async (force: boolean) => {
  const marks = await sendCommand(`start ${force ? "force" : ""}`, 1000);

  if (!marks) return null;

  const commandResult = await whaitForCommandResult({
    startMark: marks[0],
    endMark: marks[1],
    successMark: ghostCommandsMarks.start.success,
  });

  return commandResult;
};
