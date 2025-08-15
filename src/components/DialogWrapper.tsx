import { useDialog } from '@/context/DialogContext';

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog.tsx";

import FormWrapper from './Form/FormWrapper'


const DialogWrapper:React.FC = () => {

   const { dialogOpen, setDialogOpen, selectedClient } = useDialog();

   const dialogText = selectedClient ? 
      {
         title: 'Edit client profile',
         description: "Make changes to the client's profile here. Click 'Save changes' when you're done.",
         button: "Save changes"
      } :
      {
         title: 'Create new client',
         description: "Write all client's profile information here. Click 'Create new one' when you're done.",
         button: "Create new one"
      }


   return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogContent
            className="sm:max-w-[425px]"
            onOpenAutoFocus={(event) => event.preventDefault()}
         >
            <DialogHeader>
               <DialogTitle>{dialogText.title}</DialogTitle>
               <DialogDescription>{dialogText.description}</DialogDescription>
            </DialogHeader>

            <FormWrapper buttonText={dialogText.button}/>

         </DialogContent>
      </Dialog>
   );
};
export default DialogWrapper;
