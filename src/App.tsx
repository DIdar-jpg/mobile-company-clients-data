import { useState } from 'react'

import ClientsTableWrapper from "./components/ClientsTable/ClientsTableWrapper";
import { Header } from "./components/Layout/Header";

import { DialogContext } from './DialogContext.ts';

import { Client } from '@/hooks/useClient';

const App: React.FC = () => {

   const [dialogOpen, setDialogOpen] = useState(false);
   const [selectedClient, setSelectedClient] = useState<Client | null>(null);

   const dialogTheme = { dialogOpen, setDialogOpen, selectedClient, setSelectedClient }

   return (
      <>
      <DialogContext.Provider value={dialogTheme}>
         <Header />
         <ClientsTableWrapper />
      </DialogContext.Provider>
      </>
   );
};

export default App;
