import { googleDriveApiKey } from "../../auth.json";
import { getGoogeDriveFileName } from "./getGoogeDriveFileName";

export const getGoogleDriveLinkData = async (link: string) => {
  const isGoogleDriveLink = new RegExp(
    "https://drive.google.com/file/d/",
    "i"
  ).test(link);

  if (!isGoogleDriveLink) {
    return null;
  }

  const docId = link.match(/d\/[^\/]*\//g)[0].replace(/(d\/|\/)/g, "");
  const googleDriveName = await getGoogeDriveFileName(
    `https://www.googleapis.com/drive/v3/files/${docId}?&key=${googleDriveApiKey}`
  );

  return {
    fileName: googleDriveName || null,
    fileUrl: `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${googleDriveApiKey}`,
  };
};
