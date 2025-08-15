// src/TableSelectionContext.tsx

import {
   createContext,
   useState,
   useContext,
   ReactNode,
   Dispatch,
   SetStateAction,
} from "react";
import useClientMutation from "@/hooks/useClientMutation";
import { toast } from "sonner";

// 1. Определяем тип для контекста
interface TableSelectionContextType {
   selectedClients: Set<string>;
   setSelectedClients: Dispatch<SetStateAction<Set<string>>>; // Теперь это корректный тип
   handleDeleteSelected: () => void;
}

// 2. Создаем контекст
const TableSelectionContext = createContext<TableSelectionContextType | undefined>(undefined);

// 3. Создаем провайдер для контекста
export const TableSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
   const { mutate } = useClientMutation();

   const handleDeleteSelected = () => {
      if (selectedClients.size === 0) {
         return toast(" ", {
            description: "You have not selected any clients.",
            position: 'bottom-center',
            action: {
               label: "OK",
               onClick: () => console.log("OK"),
            },
         });
      }

      // Вызов мутации для каждого выбранного ID
      selectedClients.forEach((id) => {
         mutate({
            method: "delete",
            url: `${id}`,
         });
      });

      // Очищаем состояние после удаления
      setSelectedClients(new Set());
   };

   const value = {
      selectedClients,
      setSelectedClients,
      handleDeleteSelected,
   };

   return (
      <TableSelectionContext.Provider value={value}>
         {children}
      </TableSelectionContext.Provider>
   );
};

// 4. Создаем хук для удобного использования
export const useTableSelection = () => {
   const context = useContext(TableSelectionContext);
   if (context === undefined) {
      throw new Error(
         "useTableSelection must be used within a TableSelectionProvider"
      );
   }
   return context;
};
