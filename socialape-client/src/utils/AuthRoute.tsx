import React from "react";
import {Redirect, Route} from "react-router-dom";
import {RouteComponentProps, RouteProps} from "react-router";

interface P {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
    authenticated: boolean
}

const AuthRoute: React.FC<P & RouteProps> = ({component: Component, authenticated, ...rest}) => (
    <Route
        {...rest}
        // @ts-ignore
        render={(props) => authenticated ? <Redirect to="/" /> : <Component {...props} />}
    />
);

export default AuthRoute;