import * as React from "react";
import {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {getUrl, Scream as IScream} from "../types";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {Card, CardContent, CardMedia, createStyles, Typography} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs";
import {ApplicationState} from "../redux/store";
import {likeScream, unlikeScream} from "../redux/actions/dataActions";
import {UserState} from "../redux/actions/userActions";
import {connect} from "react-redux";
import MyButton from "../utils/MyButton";
import {FavoriteBorder, Favorite as FavoriteIcon} from "@material-ui/icons";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";

const styles = createStyles({
    card: {
        position: "relative",
        display: "flex",
        marginBottom: 20
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: "cover"
    }
});

interface Props {
    likeScream: typeof likeScream
    unlikeScream: typeof unlikeScream
    user: UserState
    scream: IScream
}

class Scream extends Component<Props & WithStyles<typeof styles>> {
    likedScream = () => {
        return (this.props.user.likes && this.props.user.likes.find(like => like.screamId === this.props.scream.screamId));
    };

    likeScream = () => this.props.likeScream(this.props.scream.screamId);
    unlikeScream = () => this.props.unlikeScream(this.props.scream.screamId);

    render() {
        dayjs.extend(relativeTime);
        const {classes, scream, user: {authenticated, credentials: {handle}}} = this.props;
        const likeButton = !authenticated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </MyButton>
        ) : (
                this.likedScream() ? (
                    <MyButton tip="Undo like" onClick={this.unlikeScream}>
                        <FavoriteIcon color="primary" />
                    </MyButton>
                ) : (
                        <MyButton tip="Like" onClick={this.likeScream}>
                            <FavoriteBorder color="primary" />
                        </MyButton>
                    )
            );
        const deleteButton = authenticated && scream.userHandle === handle ? (
            <DeleteScream screamId={scream.screamId} />
        ) : null;

        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image} image={getUrl(scream.imageUrl)} title="Profile image" />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${scream.userHandle}`} color="primary">
                        {scream.userHandle}
                    </Typography>
                    <br />
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(scream.createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">{scream.body}</Typography>
                    {likeButton}
                    <span>{scream.likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{scream.commentCount}Comments</span>
                    <ScreamDialog screamId={scream.screamId} userHandle={scream.userHandle} />
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user
});

const mapActionsToProps = {
    likeScream,
    unlikeScream
};

// @ts-ignore
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withRouter(Scream)));