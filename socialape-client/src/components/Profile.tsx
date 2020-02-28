import * as React from "react";
import {Component, Fragment} from "react";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {Button, createStyles, Link as MuiLink, Typography} from "@material-ui/core";
import {ApplicationState} from "../redux/store";
import {UserState} from "../redux/reducers/userReducer";
import {ReactNode} from "react";
import {Paper} from "@material-ui/core";
import {CalendarToday, Link as LinkIcon, LocationOn} from "@material-ui/icons";
import dayjs from "dayjs";
import {getUrl} from "../types";
import theme from "../utils/theme";

const styles = createStyles({
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
});

interface Props {
    user: UserState
}

class Profile extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, {}> {
    render() {
        const {
            classes,
            user: {
                credentials: {handle, createdAt, imageUrl, bio, website, location},
                loading,
                authenticated
            }
        } = this.props;

        let profileMarkup: ReactNode;
        if (loading) {
            profileMarkup = (<p>loading...</p>);
        }
        else if (authenticated) {
            profileMarkup = (
                <Paper className={classes.paper}>
                    <div className={classes.profile}>
                        <div className="image-wrapper">
                            <img src={getUrl(imageUrl)} alt="profile" className="profile-image" />
                        </div>
                        <hr />
                        <div className="profile-details">
                            <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                                @{handle}
                            </MuiLink>
                            <hr />
                            {bio && (<Typography variant="body2">{bio}</Typography>)}
                            <hr />
                            {location && (
                                <Fragment>
                                    <LocationOn color="primary" />
                                    <span>{location}</span>
                                    <hr />
                                </Fragment>
                            )}
                            {website && (
                                <Fragment>
                                    <LinkIcon color="primary" />
                                    <a href={website} target="_blank" rel="noopener noreferrer">
                                        {" "}{website}
                                    </a>
                                </Fragment>
                            )}
                            <br />
                            <CalendarToday color="primary" />{" "}
                            <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
                        </div>
                    </div>
                </Paper>
            );
        }
        else {
            profileMarkup = (
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">
                        No profile found, please login again!
                    </Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" component={Link} to="/login">
                            Login
                        </Button>
                        <Button variant="contained" color="secondary" component={Link} to="/signup">
                            Signup
                        </Button>
                    </div>
                </Paper>
            );
        }
        return profileMarkup;
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user
});

// @ts-ignore
export default connect(mapStateToProps)(withStyles(styles)(withRouter(Profile)));