export interface progressObject {
  [hash: string]: number;
}

export interface AcceptedFile extends File {
  hash?: string;
  failMessage?: string;
  successMessage?: string;
}

export interface fileHostObject {
  label: string; // Display name for the host
  value: string; // value passed as argument to function
  direct: boolean; // Can generate direct link
  description: string; // Description of the host
  link: string; // Link to the host's website
  favicon: string; // Favicon for the host
  cors: boolean; // Whether the host requires CORS
  enabled: boolean; // Whether the host is enabled
  config?: object; // Configuration object for the host
}

export interface fileHostStoreObject {
  [key: string]: {
    enabled: boolean;
    config?: object;
  };
}

export type historyLinkList = {
  fileName: string;
  downloadLink: string;
}[];

export interface FileCopyStatusObject {
  [hash: string]: "idle" | "done";
}
