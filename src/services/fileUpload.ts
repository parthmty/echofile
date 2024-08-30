import { progressObject, AcceptedFile } from "@/types";

export async function fileUpload(
  file: AcceptedFile,
  host: string,
  setFileProgress: React.Dispatch<React.SetStateAction<progressObject>>
): Promise<string> {
  const { uploadFile } = (await import(`../fileHosts/${host}.ts`)) as {
    uploadFile: (
      file: AcceptedFile,
      setFileProgress: React.Dispatch<React.SetStateAction<progressObject>>
    ) => Promise<string>;
  };
  return uploadFile(file, setFileProgress);
}
