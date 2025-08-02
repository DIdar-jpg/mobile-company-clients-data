import { Client } from "@/hooks/useClient";
import {
   Drawer,
   DrawerContent,
   DrawerHeader,
   DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface DrawerWrapperProps {
   drawerOpen: boolean;
   setDrawerOpen: (arg: boolean) => void; // <-- Изменено здесь
   selectedClient: Client | null;
   openEditDialog: (client: Client) => void;
   handleDelete: (client: Client, action: (arg: boolean) => void) => void;
}
const DrawerWrapper = ({
   drawerOpen,
   setDrawerOpen,
   selectedClient,
   openEditDialog,
   handleDelete,
}: DrawerWrapperProps) => {

   const formatKey = (key: string) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1');
      return formattedKey[0].toUpperCase() + formattedKey.slice(1);
   };

   return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
         <DrawerContent>
            <DrawerHeader>
               <DrawerTitle className="font-bold">Client Info</DrawerTitle>
            </DrawerHeader>

            {selectedClient && (
               <div className="p-4 space-y-2">
                  {Object.entries(selectedClient).map(([key, value]) => {
                     if(key !== 'id'){
                        return (
                           <p key={key}>
                              <strong>{formatKey(key)}:</strong> {value}
                           </p>
                        );
                     }
                  })}
                  <div className="flex justify-between pt-4 border-t">
                     <strong>Actions</strong>
                     <div className="flex gap-3">
                        <Button
                           className="bg-warning text-popover-foreground hover:bg-warning"
                           onClick={() => {
                              openEditDialog(selectedClient);
                           }}
                        >
                           Change
                        </Button>
                        <Button
                           variant="destructive"
                           className="text-popover-foreground hover:bg-destructive"
                           onClick={() => {
                              handleDelete(selectedClient, setDrawerOpen);
                           }}
                        >
                           Delete
                        </Button>
                     </div>
                  </div>
               </div>
            )}
         </DrawerContent>
      </Drawer>
   );
};
export default DrawerWrapper;
