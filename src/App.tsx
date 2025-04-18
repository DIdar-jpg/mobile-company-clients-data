import ClientsTableWrapper from "./components/ClinetsTable/ClientsTableWrapper";
import { Header } from "./components/Layout/Header";

const App: React.FC = () => {
   
   return (
      <>
         <Header />
         <ClientsTableWrapper />
      </>
   );
};

export default App;
