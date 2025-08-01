import { createContext, Dispatch, SetStateAction } from 'react';
import { Client } from '@/hooks/useClient';

interface DialogContextInterFace {
   dialogOpen: boolean;
   setDialogOpen: Dispatch<SetStateAction<boolean>>;
   selectedClient: Client | null;
   setSelectedClient: Dispatch<SetStateAction<Client | null>>;
}

export const DialogContext = createContext<DialogContextInterFace>({
   dialogOpen: false,
   setDialogOpen: () => {  },
   selectedClient: null,
   setSelectedClient: () => {},
 });
