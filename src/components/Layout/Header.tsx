import React from "react";
import { Button } from "../ui/button";
import { useTheme } from "@/components/ThemeProvider";

import { SunMoon, UserRoundPlus } from "lucide-react";

export const Header: React.FC = () => {
   const { theme, setTheme } = useTheme();
   return (
      <header className="w-full py-4">
         <nav className="container flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Clients Data</h1>

            <div>
               <Button variant={"ghost"} size={"icon"} className="text-primary">
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
