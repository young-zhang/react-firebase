import * as React from "react";
import {Component, Fragment} from "react";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {Button, createStyles, Link as MuiLink, Typography} from "@material-ui/core";
import {ApplicationState} from "../redux/store";
import {logoutUser, uploadImage, UserState} from "../redux/actions/userActions";
import {ReactNode} from "react";
import {Paper} from "@material-ui/core";
import {CalendarToday, Edit as EditIcon, KeyboardReturn, Link as LinkIcon, LocationOn} from "@material-ui/icons";
import dayjs from "dayjs";
import {getUrl} from "../types";
import theme from "../utils/theme";
import EditDetails from "./EditDetails";
import MyButton from "../utils/MyButton";

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
    logoutUser: typeof logoutUser,
    uploadImage: typeof uploadImage,
}

class Profile extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, {}> {
    handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event?.target?.files && event.target.files.length > 0) {
            const image: File = event.target.files[0];
            const formData = new FormData();
            formData.append("image", image, image.name);
            this.props.uploadImage(formData);
        }
    };

    handleEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    handleLogout = () => {
        this.props.logoutUser();
    };

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
                            <input type="file" id="imageInput" hidden onChange={this.handleImageChange} />
                            <MyButton tip="Edit profile picture" onClick={this.handleEditPicture} btnClassName="button">
                                <EditIcon color="primary" />
                            </MyButton>
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
                        <MyButton tip="Logout" onClick={this.handleLogout}>
                            <KeyboardReturn color="primary" />
                        </MyButton>
                        <EditDetails />
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

const mapActionsToProps = {logoutUser, uploadImage};

// @ts-ignore
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withRouter(Profile)));