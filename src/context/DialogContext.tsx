
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { Client } from '@/hooks/useClient';

interface DialogContextInterFace {
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
    selectedClient: Client | null;
    setSelectedClient: Dispatch<SetStateAction<Client | null>>;
}

export const DialogContext = createContext<DialogContextInterFace | undefined>(undefined);


export const DialogContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const value = { dialogOpen, setDialogOpen, selectedClient, setSelectedClient };

    return (
      <DialogContext.Provider value={value}>
         {children}
      </DialogContext.Provider>
    );
};


export const useDialog = () => {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogContextProvider');
    }
    return context;
};