import React, {Component, useState} from 'react';
import './App.css';
// import Home from './Home';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AccountHolderDetails, Login} from "./components";
// import ClientList from './ClientList';
// import ClientEdit from "./ClientEdit";

const App = () => {
    return (
        <Router>
          <Routes>
            <Route index element={<Login />}/>
            {/*<Route path='/clients' exact={true} component={ClientList}/>*/}
              <Route path='/accountHolder/:id' element={<AccountHolderDetails />}/>
          </Routes>
        </Router>
    )
}

export default App;