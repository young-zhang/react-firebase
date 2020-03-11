import * as React from "react";
import {Component, Fragment} from "react";
import {createStyles, Dialog, CircularProgress, Grid, Typography, DialogContent} from "@material-ui/core";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {ApplicationState} from "../redux/store";
import {getScream} from "../redux/actions/dataActions";
import {Scream, getUrl} from "../types";
import {UiState} from "../redux/actions/uiActions";
import MyButton from "../utils/MyButton";
import {Close, UnfoldMore} from "@material-ui/icons";
import dayjs from "dayjs";

const styles = createStyles({
    invisibleSeparator: {
        border: 'none',
        margin: 4
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {

    }
});

interface Props {
    getScream: typeof getScream
    screamId: string
    userHandle: string
    scream: Scream
    UI: UiState
}

interface State {
    open: boolean
}

class ScreamDialog extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
    readonly state: State = {
        open: false
    };

    handleOpen = () => {
        this.setState({open: true});
        this.props.getScream(this.props.screamId);
    }

    handleClose = () => {
        this.setState({open: false});
    }

    render() {
        const {
            classes,
            scream: {screamId, body, createdAt, likeCount, commentCount, userImage, userHandle},
            UI: {loading}
        } = this.props;

        const dialogMarkup = loading
            ? (
                <CircularProgress size={200} />
            )
            : (
                <Grid container spacing={10}>
                    <Grid item sm={5}>
                        <img src={getUrl(userImage)} alt="Profile" className={classes.profileImage} />
                    </Grid>
                    <Grid item sm={7}>
                        <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
                            @{userHandle}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body2" color="textSecondary">
                            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body1">
                            {body}
                        </Typography>
                    </Grid>
                </Grid>
            );

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Expand scream" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <Close />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    scream: state.data.scream,
    UI: state.UI
});

const mapActionsToProps = {
    getScream
};

// @ts-ignore
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withRouter(ScreamDialog)));