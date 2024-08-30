import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useState, Dispatch, SetStateAction } from "react";
import { getHash } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { fileUpload } from "@/services/fileUpload";
import { Loader2, TriangleAlert, Copy } from "lucide-react";
import {
  progressObject,
  AcceptedFile,
  fileHostObject,
  historyLinkList,
  FileCopyStatusObject,
} from "@/types";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Dropzone({
  fileHosts,
  hostValue,
  setHostValue,
  setHistoryLinks,
  ...props
}: {
  fileHosts: fileHostObject[];
  hostValue: string;
  setHostValue: (value: string) => void;
  setHistoryLinks: Dispatch<SetStateAction<historyLinkList>>;
  className?: string;
}) {
  const enum FILE_LIMITS {
    SIZE = 20 * 1048576,
  }
  const { toast } = useToast();
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const uploadElement = e.currentTarget.querySelector("input");
    uploadElement?.click();
  }

  const [files, setFiles] = useState<Array<AcceptedFile>>([]);
  const [fileProgress, setFileProgress] = useState<progressObject>({});
  const [open, setOpen] = useState(false);
  const [directDownload, setDirectDownload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "done"
  >("idle");
  const [fileCopyStatus, setFileCopyStatus] = useState<FileCopyStatusObject>(
    {}
  );
  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    const p = e.currentTarget.querySelector("p") as HTMLParagraphElement;
    e.currentTarget.classList.add("border-zinc-400");
    e.currentTarget.querySelectorAll("path").forEach((pathELement) => {
      pathELement.classList.add("fill-zinc-500");
    });
    p?.classList.add("text-zinc-500");
    p.textContent = "Release to add files";
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    changeToWaitMode(e);
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    changeToWaitMode(e);
    // console.log(e);
    const fileHandles: AcceptedFile[] = [...e.dataTransfer.items]
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((item) => item !== null);
    await addFileHandles(fileHandles);
  }

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    // console.log(e.target.files);
    const fileHandles: AcceptedFile[] = e.target.files
      ? [...e.target.files]
      : [];

    console.log(fileHandles);
    await addFileHandles(fileHandles);
  }

  async function addFileHandles(fileHandles: AcceptedFile[]) {
    const newFileHandles = [];
    const newFileProgress: progressObject = {};
    for (const handle of fileHandles) {
      // Size Check
      if (handle.size > FILE_LIMITS.SIZE) {
        toast({
          title: handle.name,
          description: `File Size should not be larger than ${
            FILE_LIMITS.SIZE / 1048576
          } MB`,
        });
        continue;
      }
      handle.hash = await getHash(handle);
      if (files.map((file) => file.hash).includes(handle.hash)) {
        toast({
          title: handle.name,
          description: "File already added",
        });
        continue;
      }

      newFileHandles.push(handle);
      newFileProgress[handle.hash] = 0;
    }
    setFiles([...files, ...newFileHandles]);
    setFileProgress({ ...fileProgress, ...newFileProgress });
  }
  function changeToWaitMode(e: React.DragEvent<HTMLDivElement>) {
    const p = e.currentTarget.querySelector("p") as HTMLParagraphElement;
    e.currentTarget.classList.remove("border-zinc-400");
    e.currentTarget.querySelectorAll("path").forEach((pathELement) => {
      pathELement.classList.remove("fill-zinc-500");
    });
    p?.classList.remove("text-zinc-500");
    p.innerHTML = `<span class="font-bold">Drag & drop</span> files here, or <span class="font-bold">click</span> to select files`;
  }

  async function handleUpload() {
    if (uploadStatus === "idle") {
      setUploadStatus("uploading");
      for (const file of files) {
        try {
          const url = await fileUpload(file, hostValue, setFileProgress);
          file.successMessage = url;

          setHistoryLinks((prevState): historyLinkList => {
            const newLink = {
              fileName: file.name,
              downloadLink: file.successMessage || "",
            };

            return [newLink, ...prevState];
          });
        } catch (error) {
          if (typeof error === "string") {
            file.failMessage = error;
          }
        }
      }
      setUploadStatus("done");
    } else if (uploadStatus === "done") {
      setFiles([]);
      setFileProgress({});
      setUploadStatus("idle");
      setHostValue("");
      setDirectDownload(false);
    }
  }

  return (
    <div className={"flex flex-col items-center" + props.className}>
      <div
        className={
          "flex flex-col justify-center items-center sm:gap-10 gap-4 border-2 border-zinc-700 hover:border-zinc-500 sm:mt-10 py-4 px-4 border-dashed rounded-3xl w-full sm:h-80 h-40 text-center cursor-pointer " +
          (uploadStatus === "uploading" || uploadStatus === "done"
            ? "hidden"
            : "")
        }
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        id="dropzone"
      >
        <svg
          viewBox="0 0 70 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 sm:w-32 pointer-events-none"
        >
          <path
            className="fill-zinc-800"
            d="M65.1997 24.6634L44.3511 22.1666C43.1144 22.015 41.8894 22.3533 40.9094 23.1233C39.9294 23.8932 39.311 25.0016 39.1593 26.2383L37.8293 37.3331H37.351C37.3802 35.5481 37.4881 33.1856 36.3594 31.7331C36.9485 32.6023 32.9381 10.0534 33.011 9.97428C32.6289 7.33763 29.9484 5.41256 27.3292 5.89088L4.83572 9.60094C2.14068 10.0209 0.309012 12.5876 0.752312 15.2827L3.78567 33.7277C3.78567 33.7744 4.07734 35.5244 4.07734 35.5244C4.3836 37.5865 6.12778 39.2928 8.18405 39.6078V64.1666C8.18405 67.3866 10.7974 70 14.0174 70H57.1841C60.4041 70 63.0175 67.3866 63.0175 64.1666V50.1665C65.1816 50.0586 67.1154 48.2415 67.3225 46.0714L69.2709 29.8545C69.6296 27.3665 67.6958 24.9136 65.1992 24.6628L65.1997 24.6634ZM6.23567 29.7267L3.78569 14.7813C3.58735 13.7838 4.32819 12.7542 5.33735 12.623L27.8189 8.92461C28.7931 8.75252 29.849 9.47878 29.9773 10.4763L32.5206 25.9346L26.0339 22.8196C24.5405 22.1079 22.7788 22.5396 21.7871 23.7996L25.8822 29.1663C25.8472 29.1663 20.9938 25.1646 20.9938 25.1646L16.9104 21.9329C16.1754 21.3496 15.2537 21.0813 14.3203 21.1862C13.3987 21.3029 12.547 21.7579 11.9637 22.4929L6.23567 29.7267ZM60.6846 64.167C60.6846 66.092 59.1095 67.667 57.1845 67.667H14.0179C12.0929 67.667 10.5178 66.092 10.5178 64.167C10.4916 60.9733 10.5383 37.5197 10.5178 35.0004C10.5178 33.0754 12.0929 31.5004 14.0179 31.5004H31.5184C33.458 31.4887 35.0126 33.1075 35.0184 35.0004V38.5005C35.0184 39.1422 35.5434 39.6672 36.1851 39.6672C38.5593 39.6555 43.6344 39.6759 46.0666 39.6672H57.1853C59.0899 39.6642 60.6882 41.2276 60.6853 43.1672C60.6736 47.2855 60.6941 59.5499 60.6853 64.1674L60.6846 64.167ZM66.9612 29.5751L65.0129 45.7921C64.9108 46.8188 64.0503 47.7113 63.0178 47.8104V43.167C63.0178 41.6387 62.4345 40.262 61.4662 39.212C62.4841 38.2612 62.385 36.4586 61.2095 35.6536L50.9308 28.1986C49.5629 27.1194 47.3987 28.0877 47.2441 29.8085L46.3458 37.3335H40.1857L41.4808 26.5187C41.5508 25.9004 41.8658 25.3404 42.3558 24.9553C42.8341 24.5674 43.4583 24.4157 44.0708 24.477L64.9194 26.9853C66.1678 27.102 67.1363 28.3326 66.9612 29.5751Z"
          />
          <path
            className="fill-zinc-800"
            d="M36.1847 52.5008H15.1845C13.8983 52.5008 12.8512 53.5479 12.8512 54.8342V63.0013C12.8512 64.2876 13.8983 65.3346 15.1845 65.3346H36.1847C37.471 65.3346 38.5181 64.2876 38.5181 63.0013V54.8342C38.5181 53.5479 37.471 52.5008 36.1847 52.5008ZM26.8513 61.8342H17.5179C15.9866 61.8109 15.9808 59.5272 17.5179 59.5009H26.8513C28.3826 59.5242 28.3884 61.808 26.8513 61.8342ZM32.6847 58.3342H17.5183C15.987 58.3109 15.9812 56.0271 17.5183 56.0009H32.6847C34.2131 56.0242 34.2218 58.3079 32.6847 58.3342Z"
          />
          <path
            className="fill-zinc-800"
            d="M37.7012 23.3335H37.5729L37.6079 23.5319C37.6312 23.4619 37.6662 23.4035 37.7012 23.3335Z"
          />
          <path
            className="fill-zinc-800"
            d="M57.1849 21.3504V4.66671C57.1849 2.08837 55.0965 0 52.5182 0H29.1847C26.8397 0 24.9029 1.72668 24.5763 3.97835C24.6142 3.97252 27.178 3.55251 27.1196 3.57001C27.5163 2.835 28.2979 2.33337 29.1846 2.33337H52.5181C53.8015 2.33337 54.8515 3.38334 54.8515 4.66672V21.0704L57.1849 21.3504Z"
          />
          <path
            className="fill-zinc-800"
            d="M50.1848 5.83376H33.478C34.108 6.49876 34.598 7.29208 34.9247 8.16711H50.1852C51.7165 8.13794 51.719 5.86295 50.1848 5.83376Z"
          />
          <path
            className="fill-zinc-800"
            d="M50.1848 14.0001C51.7161 13.971 51.719 11.696 50.1848 11.6668H35.6479L36.0329 14.0001H50.1848Z"
          />
          <path
            className="fill-zinc-800"
            d="M50.1848 17.4998H36.6163L37.0013 19.8331H50.1846C51.7158 19.804 51.719 17.529 50.1848 17.4998Z"
          />
          <path
            className="fill-zinc-800"
            d="M15.1845 36.1666H29.1846C30.713 36.1374 30.7188 33.8624 29.1846 33.8333H15.1845C13.6562 33.8624 13.6474 36.1374 15.1845 36.1666Z"
          />
          <path
            className="fill-zinc-800"
            d="M21.0385 20.0288C22.9343 19.7167 24.2964 18.1329 24.4101 16.2925C21.7472 17.4679 18.5942 15.2046 18.8568 12.3054C14.4759 14.1429 16.2988 20.7433 21.0385 20.0288Z"
          />
        </svg>
        <p className="text-md text-zinc-700 sm:text-lg pointer-events-none">
          <span className="sm:inline hidden">
            <strong>Drag & drop</strong> files here, or{" "}
          </span>
          <strong>Click</strong> to select files
        </p>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-4 mt-5 sm:mt-10">
          {files.map((file) => {
            return (
              <Card key={file.hash} className="flex flex-col gap-2 p-4">
                <div className="flex text-sm text-zinc-300">
                  <p className="text-ellipsis text-nowrap overflow-hidden">
                    {file.name.substring(0, file.name.length - 8)}
                  </p>
                  <p>
                    {file.name.substring(
                      file.name.length - 8,
                      file.name.length
                    )}
                  </p>
                </div>
                <Progress
                  value={fileProgress[file.hash === undefined ? "" : file.hash]}
                  className="h-2"
                />
                {file.failMessage ? (
                  <div className="flex items-center gap-2 mt-3">
                    <TriangleAlert className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm">{file.failMessage}</p>
                  </div>
                ) : null}
                {file.successMessage ? (
                  <div className="flex justify-between items-center gap-2 bg-zinc-900 mt-3 py-1 pr-1 pl-2 rounded-sm">
                    <p className="text-ellipsis text-green-400 text-nowrap text-sm truncate">
                      {file.successMessage}
                    </p>
                    <Button
                      variant={"outline"}
                      className={
                        "p-1 h-8" +
                        (fileCopyStatus[file.hash as string] === "done"
                          ? " bg-green-700 text-zinc-100 outline-none hover:bg-green-800 hover:text-zinc-100"
                          : "")
                      }
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          file.successMessage ?? ""
                        );
                        setFileCopyStatus({
                          ...fileCopyStatus,
                          [file.hash as string]: "done",
                        });
                        setTimeout(() => {
                          setFileCopyStatus({
                            ...fileCopyStatus,
                            [file.hash as string]: "idle",
                          });
                        }, 2000);
                      }}
                    >
                      {file.hash && fileCopyStatus[file.hash] === "done" ? (
                        <Check className="h-4" />
                      ) : (
                        <Copy className="h-4" />
                      )}
                    </Button>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
        <div
          className={
            "flex items-center space-x-2 mt-10" +
            (uploadStatus === "uploading" || uploadStatus === "done"
              ? " hidden"
              : "")
          }
        >
          <Checkbox
            id="direct-download"
            {...(files.length > 0 ? {} : { disabled: true })}
            checked={directDownload}
            onCheckedChange={(e) => {
              setDirectDownload(!!e);
              setHostValue("");
            }}
          />
          <label
            htmlFor="direct-download"
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            Generate a direct download link
          </label>
        </div>
        <div
          className={
            "flex justify-between items-center mt-8 w-full" +
            (uploadStatus === "uploading" || uploadStatus === "done"
              ? " hidden"
              : "")
          }
        >
          <p className={"text-sm " + (files.length > 0 ? "" : "opacity-70")}>
            Select Host
          </p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between w-[230px]"
                disabled={files.length < 1}
              >
                {hostValue
                  ? fileHosts.find((fileHost) => fileHost.value === hostValue)
                      ?.label
                  : "No Provider Selected"}
                <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[230px]">
              <Command>
                <CommandInput placeholder="Search Host..." />
                <CommandList>
                  <CommandEmpty className="p-2 text-center text-sm">
                    No Hosts Found.
                    <br />
                    <span className="text-xs text-zinc-400">
                      Please enable file hosts in the Hosts tab.
                    </span>
                  </CommandEmpty>
                  <CommandGroup>
                    {fileHosts
                      .filter((fileHost) => fileHost.enabled)
                      .filter((fileHost) =>
                        directDownload ? fileHost.direct : true
                      )
                      .map((fileHost) => (
                        <CommandItem
                          key={fileHost.value}
                          value={fileHost.value}
                          onSelect={(currentValue) => {
                            setHostValue(
                              currentValue === hostValue ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              hostValue === fileHost.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {fileHost.label}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end gap-4 my-10 w-full">
          <Button
            variant="destructive"
            id="cancelNow"
            disabled={uploadStatus === "idle" ? true : false}
            className={uploadStatus === "done" ? "hidden" : ""}
          >
            Cancel
          </Button>
          <Button
            disabled={
              (hostValue && uploadStatus === "idle") || uploadStatus === "done"
                ? false
                : true
            }
            onClick={handleUpload}
          >
            {uploadStatus === "uploading" ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : null}
            {uploadStatus === "idle"
              ? "Upload"
              : uploadStatus === "done"
              ? "Go Back"
              : "Uploading..."}
          </Button>
        </div>
      </div>
    </div>
  );
}
