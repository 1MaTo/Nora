import { ghostCommandsMarks } from "../../utils/globals";
import {
  sendCommand,
  whaitForCommandResult,
} from "../../utils/requestToGuiServer";

export const pubGame = async (gamename: string | undefined) => {
  const marks = await sendCommand(`pub ${gamename ? gamename : ""}`);

  if (!marks) return null;

  const commandResult = await whaitForCommandResult({
    startMark: marks[0],
    endMark: marks[1],
    successMark: ghostCommandsMarks.pub.success,
  });

  return commandResult;
};
