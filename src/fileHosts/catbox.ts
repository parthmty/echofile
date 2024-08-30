import { progressObject, AcceptedFile } from "@/types";
import { CORS_BYPASS_URL } from "./_corsBypass";
import fileHosts from "./_hostList";

export async function uploadFile(
  file: AcceptedFile,
  setFileProgress: React.Dispatch<React.SetStateAction<progressObject>>
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const cancelElement = document.getElementById(
      "cancelNow"
    ) as HTMLButtonElement;

    cancelElement.addEventListener("click", () => {
      xhr.abort();
    });

    xhr.addEventListener("abort", () => {
      reject("Upload is cancelled");
    });

    xhr.addEventListener("error", () => {
      reject("Failed to upload file");
    });

    xhr.addEventListener("load", () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject("Failed to upload file");
        return;
      }
      const response = xhr.responseText;
      resolve(response);
    });

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setFileProgress((prev) => {
          return {
            ...prev,
            [file.hash as string]: percent,
          };
        });
      }
    });

    const formData = new FormData();
    formData.append("fileToUpload", file);
    formData.append("reqtype", "fileupload");
    xhr.open(
      "POST",
      `${
        fileHosts.find((host) => host.value === "catbox")?.cors
          ? CORS_BYPASS_URL
          : ""
      }https://catbox.moe/user/api.php`,
      true
    );

    xhr.send(formData);
  });
}