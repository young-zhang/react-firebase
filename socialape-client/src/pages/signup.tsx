import * as React from "react";
import {Component} from "react";
import {Button, CircularProgress, Grid, TextField, Typography} from "@material-ui/core";
import AppIcon from "../images/icon.png";
import {FormEventHandler} from "react";
import {RouteComponentProps, withRouter, Link} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import styles from "../utils/styles";
import {ApplicationState} from "../redux/store";
import {NewUserData, signupUser} from "../redux/actions/userActions";
import {connect} from "react-redux";
import {UserState} from "../redux/reducers/userReducer";
import {UiState} from "../redux/reducers/uiReducer";

interface State {
    email: string
    password: string
    confirmPassword: string
    handle: string
    err: {
        email: string | null
        password: string | null
        confirmPassword: string | null
        handle: string | null
        error: string | null
        general: string | null
    }
}

interface Props {
    signupUser: typeof signupUser
    user: UserState
    UI: UiState
}

class Signup extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
    readonly state: State = {
        email: "",
        password: "",
        confirmPassword: "",
        handle: "",
        err: {email: null, password: null, confirmPassword: null, handle: null, error: null, general: null},
    };

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props & RouteComponentProps & WithStyles<typeof styles>>, nextContext: any): void {
        if (nextProps.UI.errors)
            this.setState({err: nextProps.UI.errors});
    }

    handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const {email, password, confirmPassword, handle} = this.state;

        const newUserData: NewUserData = {email, password, confirmPassword, handle};
        this.props.signupUser(newUserData, this.props.history);
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        // @ts-ignore
        this.setState({[event.target.name]: event.target.value});
    };

    render() {
        const {classes, UI: {loading}} = this.props;
        const {email, password, confirmPassword, handle, err} = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm />
                <Grid item sm>
                    <img src={AppIcon} alt="monkey" className={classes.image} />
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email"
                                   className={classes.textField}
                                   value={email}
                                   error={!!err.email}
                                   helperText={err.email}
                                   onChange={this.handleChange} fullWidth />
                        <TextField id="password" name="password" type="password" label="Password"
                                   className={classes.textField}
                                   value={password}
                                   error={!!err.password}
                                   helperText={err.password}
                                   onChange={this.handleChange} fullWidth />
                        <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password"
                                   className={classes.textField}
                                   value={confirmPassword}
                                   error={!!err.confirmPassword}
                                   helperText={err.confirmPassword}
                                   onChange={this.handleChange} fullWidth />
                        <TextField id="handle" name="handle" type="handle" label="handle"
                                   className={classes.textField}
                                   value={handle}
                                   error={!!err.handle}
                                   helperText={err.handle}
                                   onChange={this.handleChange} fullWidth />
                        {(err.general || err.error) && (
                            <Typography variant="body2" className={classes.customError}>
                                {err.general}
                                {err.error}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" disabled={loading} className={classes.button}>
                            Signup
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <br />
                        <small>Already have an account? Login <Link to="/login">here</Link>!</small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user,
    UI: state.UI
});

// @ts-ignore
export default connect(mapStateToProps, {signupUser})(withStyles(styles)(withRouter(Signup)));