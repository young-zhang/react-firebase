import * as React from "react";
import {Component, Fragment} from "react";
import {Button, CircularProgress, createStyles, Dialog, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import {RouteComponentProps, withRouter} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {ApplicationState} from "../redux/store";
import {UiState} from "../redux/actions/uiActions";
import {clearErrors, postScream} from "../redux/actions/dataActions";
import MyButton from "../utils/MyButton";
import {FormEventHandler} from "react";

const styles = createStyles({
    submitButton: {
        position: "relative",
        float: "right",
        marginTop: 10
    },
    progressSpinner: {
        position: "absolute"
    },
    closeButton: {
        position: "absolute",
        left: '91%',
        top: '6%'
    },
    textField: {},

});

interface Props {
    postScream: typeof postScream
    clearErrors: typeof clearErrors
    UI: UiState
}

interface State {
    open: boolean
    body: string
    errors: any
}

class PostScream extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
    readonly state: State = {
        open: false,
        body: "",
        errors: {}
    };

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props & RouteComponentProps & WithStyles<typeof styles>>, nextContext: any): void {
        if (nextProps.UI.errors) {
            this.setState({errors: nextProps.UI.errors});
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({body: "", open: false, errors: {}});
        }
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.props.clearErrors();
        this.setState({open: false, errors: {}});
    };

    handleChange = (event: any) => {
        // @ts-ignore
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        this.props.postScream({body: this.state.body});
    };

    render() {
        console.log(`state.open = ${this.state.open}`);
        const {errors} = this.state;
        const {classes, UI: {loading}} = this.props;
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Post a Scream!">
                    <AddIcon />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>Post a new scream!</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField name="body" type="text" label="SCREAM!!" multiline rows="3"
                                       placeholder="Scream at your fellow apes"
                                       error={!!errors.body}
                                       helperText={errors.body}
                                       className={classes.textField}
                                       onChange={this.handleChange}
                                       fullWidth />
                            <Button type="submit"
                                    variant="contained" color="primary" className={classes.submitButton}
                                    disabled={loading}>
                                Submit
                                {loading && (<CircularProgress size={30} className={classes.progressSpinner} />)}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    UI: state.UI
});

const mapActionsToProps = {
    postScream,
    clearErrors
};

// @ts-ignore
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withRouter(PostScream)));