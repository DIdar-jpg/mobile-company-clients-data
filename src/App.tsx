import { Toaster } from "sonner";
import ClientsTableWrapper from "./components/ClientsTable/ClientsTableWrapper";
import { Header } from "./components/Layout/Header";

import { DialogContextProvider } from "./context/DialogContext.tsx";
import { TableSelectionProvider } from "./context/TableSelectionContext.tsx"; // Импортируем только провайдер

const App: React.FC = () => {
   return (
      <>
         <DialogContextProvider>
            <TableSelectionProvider>
               <Header />
               <ClientsTableWrapper />
               <Toaster /> 
            </TableSelectionProvider>
         </DialogContextProvider>
      </>
   );
};

export default App;
