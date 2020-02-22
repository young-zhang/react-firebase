import * as React from "react";
import {Component} from "react";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {createStyles} from "@material-ui/core";

const styles = createStyles({});

class Login extends Component<WithStyles<typeof styles>> {
    render() {
        const {classes} = this.props;
        return (
            <div>
                <h1>Login page</h1>
            </div>
        );
    }
}

export default withStyles(styles)(Login);