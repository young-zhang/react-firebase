import * as React from "react";
import {Component} from "react";
import {getUrl, IScream} from "../types";
import withStyles, {ClassNameMap} from "@material-ui/core/styles/withStyles";
import {Card, CardContent, CardMedia, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

const styles = {
    card: {
        display: "flex",
        marginBottom: 20
    },
    image: {
        minWidth: 200,
    },
    content: {
        // padding: 25,
        //objectFit: "cover"
    }
};

interface P {
    scream: IScream
    classes: ClassNameMap
}

class Scream extends Component<P> {
    render() {
        const {classes, scream} = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image} image={getUrl(scream.imageUrl)} title="Profile image" />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${scream.userHandle}`} color="primary">
                        {scream.userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">{scream.createdAt}</Typography>
                    <Typography variant="body1">{scream.body}</Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(Scream);