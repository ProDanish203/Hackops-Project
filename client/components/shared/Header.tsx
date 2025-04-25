import { Suspense } from "react";
import { SearchBar, ToggleTheme, UserAvatar } from "../helpers";
import { Notifications } from "./Notifications";

export const Header = () => {
  return (
    <header className="z-20 bg-bg dark:bg-darkBg sticky top-0 md:px-10 px-2 sm:py-5 py-3.5 border-b dark:border-neutral-800 flex items-center justify-between gap-x-2 w-full">
      <Suspense fallback={<p>Loading...</p>}>
        <SearchBar />
      </Suspense>
      <div className="flex items-center gap-x-2">
        <Notifications />
        <ToggleTheme />
        <div className="max-md:hidden h-10 bg-neutral-200 w-[2px] rounded-lg mx-2" />
        <UserAvatar />
      </div>
    </header>
  );
};
