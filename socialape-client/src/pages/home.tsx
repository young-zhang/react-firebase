import * as React from "react";
import {Component} from "react";
import {Grid} from "@material-ui/core";
import Scream from "../components/Scream";
import {Scream as IScream} from "../types";
import Profile from "../components/Profile";
import {ApplicationState} from "../redux/store";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {DataState, getScreams} from "../redux/actions/dataActions";

interface Props {
    data: DataState
    getScreams: typeof getScreams
}

class Home extends Component<Props> {
    componentDidMount(): void {
        this.props.getScreams();
    }

    render() {
        const {screams, loading} = this.props.data;
        let recentScreamsMarkup = !loading
            ? screams.map((scream: IScream) => <Scream key={scream.screamId} scream={scream} />)
            : (<p>Loading...</p>);
        return (
            // "The [Grid] spacing property is an integer between 0 and 10 inclusive" and cannot be 16!
            // see: https://material-ui.com/components/grid/#spacing
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    data: state.data
});

// @ts-ignore
export default connect(mapStateToProps, {getScreams})(withRouter(Home));