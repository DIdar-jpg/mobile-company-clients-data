import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useTheme } from "@/components/ThemeProvider";

import { SunMoon, UserRoundPlus } from "lucide-react";

import { DialogContext } from '@/DialogContext.ts';

export const Header: React.FC = () => {
   const { theme, setTheme } = useTheme();

   const { setDialogOpen } = useContext(DialogContext);

   return (
      <header className="w-full py-4">
         <nav className="container flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Clients Data</h1>

            <div>
               <Button variant={"ghost"} size={"icon"} className="text-primary" onClick={() => { setDialogOpen(true) }}>
                  <UserRoundPlus className="size-8" />
               </Button>
               <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="text-primary"
                  onClick={(): void =>
                     theme === "light" ? setTheme("dark") : setTheme("light")
                  }
               >
                  <SunMoon className="size-8" />
               </Button>
            </div>
         </nav>
      </header>
   );
};
