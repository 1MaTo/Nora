import JSZip from "jszip";

export const zipString = async (fileName: string, data: string) => {
  const zip = new JSZip();
  zip.file(fileName, data);
  return await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
  });
};
