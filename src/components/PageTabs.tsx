import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PageTabs({
  currentTab,
  setCurrentTab,
}: {
  currentTab: PageTabTypes;
  setCurrentTab: (tab: PageTabTypes) => void;
}) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    switch (target.id) {
      case PageTabTypes.UPLOAD:
        setCurrentTab(PageTabTypes.UPLOAD);
        break;
      case PageTabTypes.HOSTS:
        setCurrentTab(PageTabTypes.HOSTS);
        break;
      case PageTabTypes.HISTORY:
        setCurrentTab(PageTabTypes.HISTORY);
        break;
    }
  }

  return (
    <Tabs defaultValue={currentTab} className="w-[400px]">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger
          value={PageTabTypes.UPLOAD}
          id={PageTabTypes.UPLOAD}
          className="capitalize"
          onClick={handleClick}
        >
          {PageTabTypes.UPLOAD}
        </TabsTrigger>
        <TabsTrigger
          value={PageTabTypes.HOSTS}
          id={PageTabTypes.HOSTS}
          className="capitalize"
          onClick={handleClick}
        >
          {PageTabTypes.HOSTS}
        </TabsTrigger>
        <TabsTrigger
          value={PageTabTypes.HISTORY}
          id={PageTabTypes.HISTORY}
          className="capitalize"
          onClick={handleClick}
        >
          {PageTabTypes.HISTORY}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export const enum PageTabTypes {
  UPLOAD = "upload",
  HOSTS = "hosts",
  HISTORY = "history",
}
