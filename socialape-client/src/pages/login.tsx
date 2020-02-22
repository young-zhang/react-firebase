import * as React from "react";
import {Component} from "react";
import {Button, CircularProgress, createStyles, Grid, TextField, Typography} from "@material-ui/core";
import AppIcon from "../images/icon.png";
import {FormEventHandler} from "react";
import Axios from "axios";
import {RouteComponentProps, withRouter, Link} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";

const styles = createStyles({
    form: {
        textAlign: "center"
    },
    image: {
        margin: "20px auto 20px auto"
    },
    pageTitle: {
        margin: "10px auto 10px auto"
    },
    textField: {
        margin: "10px auto 10px auto"
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        position: "relative"
    },
    customError: {
        color: "red",
        fontSize: "0.8rem"
    },
    progress: {
        position: "absolute"
    },
});

interface State {
    email: string
    password: string
    loading: boolean
    err: {
        email: string | null
        password: string | null
        error: string | null
        general: string | null
    }
}

interface Props {
}

class Login extends Component<Props & RouteComponentProps<Props> & WithStyles<typeof styles>, State> {
    state = {
        email: "",
        password: "",
        loading: false,
        err: {email: null, password: null, error: null, general: null},
    };

    handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const {email, password} = this.state;
        Axios.post("/login", {email, password})
            .then(res => {
                console.log(res);
                this.setState({loading: false});
                this.props.history.push("/");
            })
            .catch(err => {
                this.setState({
                    err: err.response.data,
                    loading: false
                });
                //console.log(this.state.err);
            });
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        // @ts-ignore
        this.setState({[event.target.name]: event.target.value});
        //console.log(this.state);
    };

    render() {
        const {classes} = this.props;
        const {email, password, err, loading} = this.state;
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
                        <TextField id="password" name="password" type="password" label="password"
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
                        <Button type="submit" variant="contained" color="primary" disabled={loading} className={classes.button}>
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

export default withStyles(styles)(withRouter(Login));