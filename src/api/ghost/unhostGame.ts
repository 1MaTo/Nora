import { ghostCommandsMarks } from "../../utils/globals";
import {
  sendCommand,
  whaitForCommandResult,
} from "../../utils/requestToGuiServer";

export const unhostGame = async () => {
  const marks = await sendCommand("unhost");

  if (!marks) return null;

  const commandResult = await whaitForCommandResult({
    startMark: marks[0],
    endMark: marks[1],
    successMark: ghostCommandsMarks.unhost.success,
  });

  return commandResult;
};
