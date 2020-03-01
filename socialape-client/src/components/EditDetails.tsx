import {RouteComponentProps, withRouter} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip} from "@material-ui/core";
import {Edit as EditIcon} from "@material-ui/icons";
import {ApplicationState} from "../redux/store";
import {editUserDetails} from "../redux/actions/userActions";
import {Credentials} from "../types";

const styles = createStyles({
    // styles here
    button: {
        float: 'right'
    },
    textField: {
        margin: "10px auto 10px auto"
    },
});

interface Props {
    editUserDetails: typeof editUserDetails
    credentials: Credentials
}

interface State {
    bio: string
    website: string
    location: string
    open: boolean
}

class EditDetails extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
    readonly state: State = {
        bio: "",
        website: "",
        location: "",
        open: false
    };

    handleOpen = () => {
        this.mapUserDetailsToState(this.props.credentials);
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({open: false});
    };

    componentDidMount(): void {
        this.mapUserDetailsToState(this.props.credentials);
    }

    handleChange = (event: any) => {
        // @ts-ignore
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = () => {
        const {bio, website, location} = this.state;
        const userDetails: Credentials = {
            bio, website, location
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    mapUserDetailsToState = (credentials: Credentials) => {
        const {bio, website, location} = credentials;
        this.setState({
            bio: bio ? bio : "",
            website: website ? website : "",
            location: location ? location : ""
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <Tooltip title="Edit details" placement="top">
                    <IconButton onClick={this.handleOpen} className={classes.button}>
                        <EditIcon color="primary" />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField type="text" multiline rows="3" className={classes.textField} fullWidth
                                       placeholder="A short bio about yourself" onChange={this.handleChange}
                                       name="bio" label="Bio" value={this.state.bio} />
                            <TextField type="text" className={classes.textField} fullWidth
                                       placeholder="Your website" onChange={this.handleChange}
                                       name="website" label="Website" value={this.state.website} />
                            <TextField type="text" className={classes.textField} fullWidth
                                       placeholder="Your location" onChange={this.handleChange}
                                       name="location" label="Location" value={this.state.location} />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleChange} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    credentials: state.user.credentials
});

const mapActionsToProps = {editUserDetails};

// @ts-ignore
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withRouter(EditDetails)));