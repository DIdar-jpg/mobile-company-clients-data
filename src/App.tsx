import ClientsTableWrapper from "./components/ClientsTable/ClientsTableWrapper";
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
