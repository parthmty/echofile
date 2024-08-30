import { historyLinkList, FileCopyStatusObject } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";

export function HistoryBox({
  historyLinks,
  ...props
}: {
  historyLinks: historyLinkList;
  className?: string;
}) {
  const [fileCopyStatus, setFileCopyStatus] = useState<FileCopyStatusObject>(
    {}
  );

  return (
    <div className={"flex flex-col pb-8 gap-4 " + props.className}>
      {historyLinks.map((historyLink) => {
        return (
          <Card
            key={historyLink.downloadLink}
            className="flex flex-col gap-2 p-4"
          >
            <div className="flex text-sm text-zinc-300">
              <p className="text-ellipsis text-nowrap overflow-hidden">
                {historyLink.fileName.substring(
                  0,
                  historyLink.fileName.length - 8
                )}
              </p>
              <p>
                {historyLink.fileName.substring(
                  historyLink.fileName.length - 8,
                  historyLink.fileName.length
                )}
              </p>
            </div>

            <div className="flex justify-between items-center gap-2 bg-zinc-900 mt-3 py-1 pr-1 pl-2 rounded-sm">
              <p className="text-ellipsis text-green-400 text-nowrap text-sm truncate">
                {historyLink.downloadLink}
              </p>
              <Button
                variant={"outline"}
                className={
                  "p-1 h-8" +
                  (fileCopyStatus[historyLink.downloadLink as string] === "done"
                    ? " bg-green-700 text-zinc-100 outline-none hover:bg-green-800 hover:text-zinc-100"
                    : "")
                }
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    historyLink.downloadLink ?? ""
                  );
                  setFileCopyStatus({
                    ...fileCopyStatus,
                    [historyLink.downloadLink as string]: "done",
                  });
                  setTimeout(() => {
                    setFileCopyStatus({
                      ...fileCopyStatus,
                      [historyLink.downloadLink as string]: "idle",
                    });
                  }, 2000);
                }}
              >
                {historyLink.downloadLink &&
                fileCopyStatus[historyLink.downloadLink] === "done" ? (
                  <Check className="h-4" />
                ) : (
                  <Copy className="h-4" />
                )}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
