import * as React from "react";
import {Component} from "react";
import {AppBar, Button, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class Navbar extends Component {
    render() {
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/signup">Signup</Button>
                </Toolbar>
            </AppBar>
        );
    }
}