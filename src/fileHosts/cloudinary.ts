import { progressObject, AcceptedFile } from "@/types";
import { CORS_BYPASS_URL } from "./_corsBypass";
import fileHosts from "./_hostList";

export async function uploadFile(
  file: AcceptedFile,
  setFileProgress: React.Dispatch<React.SetStateAction<progressObject>>
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Key: 494918117845891
    const API_KEY = (
      fileHosts.find((host) => host.value === "cloudinary") as {
        config: { API_Key: string };
      }
    )?.config.API_Key;

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

    xhr.addEventListener("load", () => {
      if (xhr.status !== 200) {
        reject("Failed to upload file");
        return;
      }
      const response = JSON.parse(xhr.responseText);
      resolve(response.secure_url);
    });

    xhr.addEventListener("error", () => {
      reject("Failed to upload file");
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
    formData.append("file", file);
    formData.append("upload_preset", "echo_demo");
    formData.append("api_key", API_KEY);
    xhr.open(
      "POST",
      `${
        fileHosts.find((host) => host.value === "cloudinary")?.cors
          ? CORS_BYPASS_URL
          : ""
      }https://api.cloudinary.com/v1_1/demo/image/upload`,
      true
    );

    xhr.send(formData);
  });
}
