import React from "react";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";

import { SunMoon, Trash, UserRoundPlus } from "lucide-react";

import { useDialog } from "@/context/DialogContext";
import { useTableSelection } from "@/context/TableSelectionContext";

interface headerButton {
   key: string,
   icon: React.FC<React.SVGProps<SVGSVGElement>>,
   action: () => void
}
export const Header: React.FC = () => {

   const { theme, setTheme } = useTheme();

   const { setDialogOpen } = useDialog();
   const { handleDeleteSelected } = useTableSelection();

   const headerButtons: headerButton[] = [
      {
         key: 'openModal',
         icon: UserRoundPlus,
         action: () => { setDialogOpen(true) }
      },
      {
         key: 'deleteClients',
         icon: Trash,
         action: handleDeleteSelected
      },
      {
         key: 'changeTheme',
         icon: SunMoon,
         action: (): void => { theme === "light" ? setTheme("dark") : setTheme("light") }
      }

   ]

   return (
      <header className="w-full py-4">
         <nav className="container flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Clients Data</h1>

            <div>
               {
                  headerButtons.map( btn => {
                     return(
                        <Button
                           key={btn.key}
                           variant={"ghost"}
                           size={"icon"}
                           className="text-primary"
                           onClick={() => btn.action()}
                        >
                           <btn.icon className="size-8" />
                        </Button>
                     )
                  })
               }
            </div>
         </nav>
      </header>
   );
};
