import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {MuiThemeProvider} from "@material-ui/core";
import './App.css';
import theme from "./utils/theme";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Navbar from "./components/Navbar";
import JwtDecode from "jwt-decode";
import AuthRoute from "./utils/AuthRoute";

const token = localStorage.getItem("fbIdToken");
let authenticated: boolean;
if (token) {
    const decodedToken: any = JwtDecode(token);
    console.log(decodedToken);
    if (decodedToken.exp * 1000 < Date.now()) {
        // window.location.href = "/login";
        authenticated = false;
    }
    else {
        authenticated = true;
    }
}

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <BrowserRouter>
                    <Navbar />
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <AuthRoute authenticated={authenticated} exact path="/login" component={Login} />
                            <AuthRoute authenticated={authenticated} exact path="/signup" component={Signup} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </MuiThemeProvider>
    );
}

export default App;