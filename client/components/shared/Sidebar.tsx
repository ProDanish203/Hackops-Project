import { navLinks } from "@/lib/data";
import { Codepen, Copyright } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between gap-y-5 h-full">
      <div>
        <div className="sm:px-5 px-2 lg:py-10 py-5 max-sm:center">
          <h2 className="text-5xl font-semibold text-text dark:text-darkText max-lg:hidden">
            Pyzon
          </h2>
          <Codepen className="lg:hidden sm:size-10 size-7" />
        </div>

        <nav className="flex flex-col">
          {navLinks.map((link, index) => (
            <Link
              href={link.path}
              key={index}
              className={`flex max-lg:justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-100 gap-x-2 items-center text-text py-5 sm:px-5 px-2 border-b dark:border-neutral-800 ${
                index === 0 && "border-t"
              }`}
            >
              {link.icon}
              <p className="max-lg:hidden dark:text-darkText text-text">
                {link.name}
              </p>
            </Link>
          ))}
        </nav>
      </div>

      <div className="sm:p-5 py-5 text-center w-full center">
        <p className="text-neutral-600 max-lg:hidden">Inventory Management</p>
        <Copyright className="lg:hidden text-neutral-600 size-6" />
      </div>
    </div>
  );
};
