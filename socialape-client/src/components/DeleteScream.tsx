import * as React from "react";
import {Component, Fragment} from "react";
import {Button, createStyles, Dialog, DialogActions, DialogTitle} from "@material-ui/core";
import {RouteComponentProps, withRouter} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {deleteScream} from "../redux/actions/dataActions";
import MyButton from "../utils/MyButton";
import {DeleteOutline} from "@material-ui/icons";

const styles = createStyles({
    deleteButton: {
        position: "absolute",
        left: "90%",
        top: "10%"
    }
});

interface Props {
    deleteScream: typeof deleteScream
    screamId: string
}

interface State {
    open: boolean
}

class DeleteScream extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
    readonly state: State = {
        open: false
    };

    handleOpen = () => this.setState({open: true});
    handleClose = () => this.setState({open: false});
    deleteScream = () => {
        this.props.deleteScream(this.props.screamId);
        this.handleClose();
    };

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <MyButton tip="Delete Scream" onClick={this.handleOpen} btnClassName={classes.deleteButton}>
                    <DeleteOutline color="secondary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Are you sure you want to delete this scream?</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.deleteScream} color="primary">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapActionsToProps = {
    deleteScream
};

// @ts-ignore
export default connect(null, mapActionsToProps)(withStyles(styles)(withRouter(DeleteScream)));