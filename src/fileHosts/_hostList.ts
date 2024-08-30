import { fileHostObject } from "../types";

const fileHosts: fileHostObject[] = [
  {
    label: "Cloudinary",
    value: "cloudinary",
    direct: true,
    description: "Cloud-based image and video management solution.",
    link: "https://cloudinary.com",
    favicon: "https://cloudinary.com/favicon.ico",
    enabled: false,
    cors: false,
    config: {
      API_Key: "",
    },
  },
  {
    label: "Buzzheavier",
    value: "buzzheavier",
    direct: false,
    description: "Simple fast anonymous file sharing for everyone.",
    link: "https://buzzheavier.com",
    favicon: "",
    enabled: true,
    cors: true,
  },
  {
    label: "file.haus",
    value: "filehaus",
    direct: true,
    description:
      "File upload service dedicated to promoting freedom of speech and protecting user privacy",
    link: "https://filehaus.top/",
    favicon: "https://filehaus.top/favicon.ico",
    enabled: true,
    cors: true,
  },
  {
    label: "SEND",
    value: "sendcm",
    direct: false,
    description: "Secure, Simple, and Private File Sharing. No registration required and free from ads and fees for basic use.",
    link: "https://send.cm/",
    favicon: "https://send.cm/favicon.ico",
    enabled: true,
    cors: false,
  },
  {
    label: "Catbox",
    value: "catbox",
    direct: true,
    description: "Catbox is a 100% free public file host, allowing uploads up to 200 MB. No ads, throttling, or download limits.",
    link: "https://catbox.moe/",
    favicon: "https://catbox.moe/favicon.ico",
    enabled: true,
    cors: true
  }
];

export default fileHosts;
