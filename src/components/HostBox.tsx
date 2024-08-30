import { useState } from "react";
import { fileHostObject } from "@/types";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleCheck, CircleX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HostBox({
  fileHosts,
  setFileHosts,
  hostValue,
  setHostValue,
  ...props
}: {
  fileHosts: fileHostObject[];
  setFileHosts: (fileHosts: fileHostObject[]) => void;
  hostValue: string;
  setHostValue: (hostValue: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [currentConfig, setCurrentConfig] = useState<fileHostObject>({
    label: "",
    value: "",
    direct: false,
    description: "",
    link: "",
    favicon: "",
    enabled: false,
    cors: false,
    config: {},
  });

  function handleToggle(host: fileHostObject) {
    const temp = [...fileHosts];
    const index = temp.findIndex((h) => h.value === host.value);
    temp[index].enabled = !host.enabled;
    setFileHosts(temp);
    if (hostValue === host.value) {
      setHostValue("");
    }
  }

  function HostConfigForm({
    fileHosts,
    hostValue,
    className,
  }: {
    fileHosts: fileHostObject[];
    hostValue: string;
    className?: string;
  }) {
    return (
      <form className={cn("grid items-start gap-4", className)}>
        {fileHosts.find((host) => host.value === hostValue)?.config &&
          Object.entries(
            fileHosts.find((host) => host.value === hostValue)?.config as object
          ).map(([key, value]) => {
            return (
              <div className="gap-2 grid" key={key}>
                <Label htmlFor={key}>{key.replace("_", " ")}</Label>
                <Input
                  id={key}
                  defaultValue={value}
                  placeholder={"Enter " + key.replace("_", " ") + " here"}
                />
              </div>
            );
          })}
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            const parent = (e.target as HTMLFormElement)
              .parentNode as HTMLFormElement;

            const inputs = parent.getElementsByTagName("input");
            const newConfig = Object.values(inputs).reduce((acc, input) => {
              return {
                ...acc,
                [input.id]: input.value,
              };
            }, {});

            // Update the config
            const temp = [...fileHosts];
            const index = temp.findIndex((h) => h.value === hostValue);
            temp[index].config = newConfig;
            setFileHosts(temp);

            setOpen(false);
            handleToggle(temp[index]);
          }}
        >
          Save changes
        </Button>
      </form>
    );
  }

  return (
    <div
      className={
        "gap-4 grid grid-flow-row sm:grid-cols-2 pb-10" + props.className
      }
    >
      {fileHosts.map((host) => {
        return (
          <Card key={host.value} className="gap-1 grid p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="bg-cover bg-no-repeat bg-center rounded-sm w-5 aspect-square"
                  style={{
                    backgroundImage: `url(${
                      host.favicon
                        ? host.favicon
                        : "https://www.svgrepo.com/download/380883/folder-document-file-archive-project.svg"
                    })`,
                  }}
                ></div>
                <a href={host.link} target="_blank" rel="noreferrer">
                  <CardTitle className="text-lg hover:underline">
                    {host.label}
                  </CardTitle>
                </a>
              </div>
              <Switch
                checked={host.enabled}
                onClick={() => {
                  // Check if the host requires configuration
                  if (host.config && Object.keys(host.config).length > 0) {
                    // Check if the host is already enabled
                    if (host.enabled) {
                      handleToggle(host);
                    } else {
                      setCurrentConfig(host);
                      setOpen(true);
                    }
                  } else {
                    handleToggle(host);
                  }
                }}
              />
            </div>
            <CardDescription>{host.description}</CardDescription>
            <CardDescription className="flex items-center gap-1 mt-2 self-end">
              {host.direct ? (
                <CircleCheck className="w-4 h-4 text-green-500" />
              ) : (
                <CircleX className="w-4 h-4 text-red-500" />
              )}{" "}
              Direct Link Support
            </CardDescription>
          </Card>
        );
      })}
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button id="configBox" className="hidden"></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DrawerTitle>Host Configuration</DrawerTitle>
              <DrawerDescription>
                Required configuration for {currentConfig.label}
              </DrawerDescription>
            </DialogHeader>
            <HostConfigForm
              fileHosts={fileHosts}
              hostValue={currentConfig.value}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button id="configBox" className="hidden"></Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Host Configuration</DrawerTitle>
              <DrawerDescription>
                Required configuration for {currentConfig.label}
              </DrawerDescription>
            </DrawerHeader>
            <HostConfigForm
              fileHosts={fileHosts}
              hostValue={currentConfig.value}
              className="px-4"
            />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
