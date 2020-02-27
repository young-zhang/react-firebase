import * as React from "react";
import {Component} from "react";
import {Button, CircularProgress, Grid, TextField, Typography} from "@material-ui/core";
import AppIcon from "../images/icon.png";
import {FormEventHandler} from "react";
import {RouteComponentProps, withRouter, Link} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import styles from "../utils/styles";
import {connect} from "react-redux";
import {ApplicationState} from "../redux/store";
import {Dispatch} from "redux";
import {loginUser, UserLoginData} from "../redux/actions/userActions";
import {UserState} from "../redux/reducers/userReducer";
import {UiState} from "../redux/reducers/uiReducer";

interface State {
    email: string
    password: string
    err: {
        email: string | null
        password: string | null
        error: string | null
        general: string | null
    }
}

interface Props {
    loginUser: typeof loginUser
    user: UserState
    UI: UiState
}

class Login extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
    state = {
        email: "",
        password: "",
        err: {email: null, password: null, error: null, general: null},
    };

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props & RouteComponentProps & WithStyles<typeof styles>>, nextContext: any): void {
        if (nextProps.UI.errors)
            this.setState({err: nextProps.UI.errors});
    }

    handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const {email, password} = this.state;
        this.props.loginUser({email, password}, this.props.history);
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        // @ts-ignore
        this.setState({[event.target.name]: event.target.value});
    };
    private loading: any;

    render() {
        const {classes, UI: {loading}} = this.props;
        const {email, password, err} = this.state;
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
                        {(err.general || err.error) && (
                            <Typography variant="body2" className={classes.customError}>
                                {err.general}
                                {err.error}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" disabled={this.loading} className={classes.button}>
                            LOGIN
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <br />
                        <small>Don't have an account? Signup <Link to="/signup">here</Link>!</small>
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

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        loginUser: (userData: UserLoginData, history: any) =>
            // @ts-ignore
            dispatch(loginUser(userData, history))
    };
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Login)));