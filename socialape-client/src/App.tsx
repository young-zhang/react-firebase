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
import {setAuthenticated, setUnauthenticated} from "./redux/reducers/userReducer";
import {getUserData} from "./redux/actions/userActions";
import Axios from "axios";

const token = localStorage.getItem("fbIdToken");

if (token) {
    const decodedToken: any = JwtDecode(token);
    console.log(decodedToken);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(setUnauthenticated());
        window.location.href = "/login";
    }
    else {
        store.dispatch(setAuthenticated());
        Axios.defaults.headers.common["Authorization"] = token;
        store.dispatch(getUserData());
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
                            <AuthRoute exact path="/login" component={Login} />
                            <AuthRoute exact path="/signup" component={Signup} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;