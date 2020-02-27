import React from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import {RouteComponentProps, RouteProps} from "react-router";
import {ApplicationState} from "../redux/store";
import {connect} from "react-redux";

interface P {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
    authenticated: boolean
}

const AuthRoute: React.FC<P & RouteProps & RouteComponentProps> = ({component: Component, authenticated, ...rest}) => (
    <Route
        {...rest}
        // @ts-ignore
        render={(props) => authenticated ? <Redirect to="/" /> : <Component {...props} />}
    />
);

const mapStateToProps = (state: ApplicationState) => ({
    authenticated: state.user.authenticated
});

// @ts-ignore
export default connect(mapStateToProps)(withRouter(AuthRoute));