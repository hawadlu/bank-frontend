import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Login} from "./components/Login.tsx";
import {AccountHolderDetails} from "./components/AccountHolderDashboard.tsx";

const App = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
              <Routes>
                <Route index element={<Login />}/>
                {/*<Route path='/clients' exact={true} component={ClientList}/>*/}
                  <Route path='/accountHolder/:id' element={<AccountHolderDetails />}/>
              </Routes>
            </Router>
        </QueryClientProvider>
    )
}

export default App;