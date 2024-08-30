import { PageTabs, PageTabTypes } from "./PageTabs";
import { useState, useEffect } from "react";
import { Dropzone } from "./Dropzone";
import { HostBox } from "./HostBox";
import { HistoryBox } from "./HistoryBox";
import fileHostsTemplate from "@/fileHosts/_hostList";
import { fileHostObject, fileHostStoreObject, historyLinkList } from "@/types";
import { storeObject, retrieveObject } from "@/services/localStore";

let fileHostList = fileHostsTemplate;
// file hosts Sync
const storedFileHosts = retrieveObject("fileHosts") as fileHostStoreObject;

if (storedFileHosts) {
  fileHostList = fileHostList.map((host) => {
    if (host.value in storedFileHosts) {
      host.enabled = storedFileHosts[host.value].enabled;

      // Optional Config
      if (storedFileHosts[host.value].config) {
        host.config = storedFileHosts[host.value].config;
      }
    }
    return host;
  });
}

// History Sync
const storedHistoryLinks = retrieveObject("historyLinks") as historyLinkList;

function App() {
  const [currentTab, setCurrentTab] = useState<PageTabTypes>(
    PageTabTypes.UPLOAD
  );
  const [fileHosts, setFileHosts] =
    useState<Array<fileHostObject>>(fileHostList);
  const [hostValue, setHostValue] = useState("");
  const [historyLinks, setHistoryLinks] = useState<historyLinkList>(
    storedHistoryLinks || []
  );

  // file host update and sync
  useEffect(() => {
    let fileHostStoreObject: fileHostStoreObject = {};
    fileHosts.forEach((host) => {
      fileHostStoreObject[host.value] = {
        enabled: host.enabled,
      };

      // Optional Config
      if (host.config) {
        fileHostStoreObject[host.value].config = host.config;
      }
    });

    storeObject("fileHosts", fileHostStoreObject);
  }, [fileHosts]);

  // history update and sync
  useEffect(() => {
    storeObject("historyLinks", historyLinks);
  }, [historyLinks]);

  window.onscroll = function () {
    // Add bottom outline to tabs when scrolled
    const tabs = document.getElementById("tabs");
    if (tabs) {
      if (window.scrollY > 0) {
        tabs.classList.add("border-b-[1px]", "border-zinc-700");
      } else {
        tabs.classList.remove("border-b-[1px]", "border-zinc-700");
      }
    }
  };

  return (
    <>
      <div
        id="tabs"
        className="top-0 z-50 sticky flex justify-center bg-background/30 backdrop-blur-md px-[20px] py-8 w-full"
      >
        <PageTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>
      <div className="px-[20px] w-full max-w-3xl">
        <div>
          <Dropzone
            fileHosts={fileHosts}
            hostValue={hostValue}
            setHostValue={setHostValue}
            setHistoryLinks={setHistoryLinks}
            className={currentTab === PageTabTypes.UPLOAD ? "" : "h-0 hidden"}
          />
          <HostBox
            fileHosts={fileHosts}
            setFileHosts={setFileHosts}
            hostValue={hostValue}
            setHostValue={setHostValue}
            className={currentTab === PageTabTypes.HOSTS ? "" : "h-0 hidden"}
          />
          <HistoryBox
            historyLinks={historyLinks}
            className={currentTab === PageTabTypes.HISTORY ? "" : "h-0 hidden"}
          />
        </div>
      </div>
    </>
  );
}

export default App;
