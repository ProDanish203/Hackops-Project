import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";

export const Notifications = () => {
  const hasNotification = true;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {hasNotification && (
            <span className="absolute z-10 top-2 right-2 inline-block size-2.5 bg-primaryCol rounded-full"></span>
          )}
          <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="max-sm:max-w-[350px] max-sm:w-full">
        <SheetHeader>
          <SheetTitle className="text-left">Notifications</SheetTitle>
          <div className="flex flex-col gap-y-2">
            <NotficationCard />
            <NotficationCard />
            <NotficationCard />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const NotficationCard = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-bg dark:bg-darkBg rounded-lg shadow-sm">
      <div className="text-left">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-darkText">
          New message from John Doe
        </h3>
        <p className="text-xs text-gray-500">Just now</p>
      </div>
      <Button variant="outline" size="icon">
        <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        <span className="sr-only">Mark As Read</span>
      </Button>
    </div>
  );
};
