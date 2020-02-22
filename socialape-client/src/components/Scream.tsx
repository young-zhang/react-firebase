import * as React from "react";
import {Component} from "react";
import {getUrl, IScream} from "../types";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {Card, CardContent, CardMedia, createStyles, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs";

const styles = createStyles({
    card: {
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

interface Props extends WithStyles<typeof styles>{
    scream: IScream
}

class Scream extends Component<Props> {
    render() {
        dayjs.extend(relativeTime);
        const {classes, scream} = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image} image={getUrl(scream.imageUrl)} title="Profile image" />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${scream.userHandle}`} color="primary">
                        {scream.userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(scream.createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">{scream.body}</Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(Scream);