import * as React from "react";
import {Component} from "react";
import {Grid} from "@material-ui/core";
import Axios from "axios";
import Scream from "../components/Scream";
import {Scream as IScream} from "../types";

export default class Home extends Component<{}, { screams: IScream[] }> {
    state = {
        screams: []
    };

    componentDidMount(): void {
        Axios.get("/screams")
            .then(res => { this.setState({screams: res.data}); });
    }

    render() {
        let recentScreamsMarkup = this.state.screams ?
            this.state.screams.map((scream: IScream) => (<Scream key={scream.screamId} scream={scream} />))
            : (<p>Loading...</p>);
        return (
            // "The [Grid] spacing property is an integer between 0 and 10 inclusive" and cannot be 16!
            // see: https://material-ui.com/components/grid/#spacing
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>
        );
    }
}