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
   handleDelete: (client: Client,  action: (arg: boolean) => void) => void
}
const DrawerWrapper = ({ drawerOpen, setDrawerOpen, selectedClient, openEditDialog, handleDelete } : DrawerWrapperProps) => {

   return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent>
         <DrawerHeader>
            <DrawerTitle className="font-bold">Client Info</DrawerTitle>
         </DrawerHeader>
         {selectedClient && (
            <div className="p-4 space-y-2">
               <p>
                  <strong>Name:</strong> {selectedClient.name}
               </p>
               <p>
                  <strong>Surname:</strong> {selectedClient.surname}
               </p>
               <p>
                  <strong>Date of Birth:</strong>{" "}
                  {selectedClient.dateOfBirth}
               </p>
               <p>
                  <strong>Sex:</strong> {selectedClient.sex}
               </p>
               <p>
                  <strong>Email:</strong> {selectedClient.email}
               </p>
               <p>
                  <strong>Number:</strong> {selectedClient.number}
               </p>
               <div className="flex justify-between pt-4 border-t">
                  <strong>Actions</strong>
                  <div className="flex gap-3">
                     <Button 
                     className="bg-warning text-popover-foreground hover:bg-warning" 
                     onClick={ () => { openEditDialog(selectedClient) }}
                     >
                        Change
                     </Button>
                     <Button
                        variant="destructive"
                        className="text-popover-foreground hover:bg-destructive"
                        onClick={() => { handleDelete(selectedClient, setDrawerOpen)}}
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
export default DrawerWrapper