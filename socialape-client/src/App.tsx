import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Navbar from "./components/Navbar";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/signup" component={Signup} />
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;