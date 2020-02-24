import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {MuiThemeProvider} from "@material-ui/core";
import {Provider} from "react-redux";
import JwtDecode from "jwt-decode";
import './App.css';
import theme from "./utils/theme";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Navbar from "./components/Navbar";
import AuthRoute from "./utils/AuthRoute";
import store from "./redux/store"

const token = localStorage.getItem("fbIdToken");
let authenticated: boolean;
if (token) {
    const decodedToken: any = JwtDecode(token);
    console.log(decodedToken);
    if (decodedToken.exp * 1000 < Date.now()) {
        authenticated = false;
        //window.location.href = "/login";
    }
    else {
        authenticated = true;
    }
}

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
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
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;