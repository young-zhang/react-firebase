import * as React from "react";
import {Component, Fragment} from "react";
import {AppBar, Button, createStyles, Toolbar} from "@material-ui/core";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {ApplicationState} from "../redux/store";
import AddIcon from "@material-ui/icons/Add"
import HomeIcon from "@material-ui/icons/Home"
import Notifications from "@material-ui/icons/Notifications"
import MyButton from "../utils/MyButton";

const styles = createStyles({
    // styles here
});

interface Props {
    authenticated: boolean
}

class Navbar extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, {}> {
    render() {
        const {authenticated} = this.props;
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <MyButton tip="Create a scream!"><AddIcon /></MyButton>
                            <Link to="/">
                                <MyButton tip="Home"><HomeIcon /></MyButton>
                            </Link>
                            <MyButton tip="Notifications"><Notifications /></MyButton>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/">Home</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    authenticated: state.user.authenticated
});

const mapActionsToProps = {
    //actionName
};

// @ts-ignore
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withRouter(Navbar)));