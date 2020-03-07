import Axios from "axios";
import {Action, ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {Scream} from "../../types";

export interface DataState {
    readonly screams: Scream[]
    readonly scream: Scream
    readonly loading: boolean
}

export const initialState: DataState = {
    screams: [],
    scream: {},
    loading: false
};

export interface LoadingDataAction extends Action<"LOADING_DATA"> {}

export interface SetScreamsAction extends Action<"SET_SCREAMS"> {payload: Scream[]}

export interface LikeScreamAction extends Action<"LIKE_SCREAM"> {payload: Scream}

export interface UnlikeScreamAction extends Action<"UNLIKE_SCREAM"> {payload: Scream}

export type DataAction = LoadingDataAction | SetScreamsAction | LikeScreamAction | UnlikeScreamAction

export const loadingData: ActionCreator<LoadingDataAction> = () => ({type: "LOADING_DATA"});
export const setScreams: ActionCreator<SetScreamsAction> = (payload: Scream[]) => ({type: "SET_SCREAMS", payload});
export const likeScream: ActionCreator<LikeScreamAction> = (scream: Scream) => ({type: "LIKE_SCREAM", payload: scream});
export const unlikeScream: ActionCreator<UnlikeScreamAction> = (scream: Scream) => ({type: "UNLIKE_SCREAM", payload: scream});

// Get all screams
export const getScreams: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction>> = () => {
    return async (dispatch) => {
        console.log("getScreams");
        dispatch(loadingData());
        Axios.get("/screams")
            .then(res => dispatch(setScreams(res.data)))
            .catch(err => {
                dispatch(setScreams([]));
                console.log(err);
            });
    };
};

// Like a scream
export const likeScreamId: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction>> = (screamId: string) => {
    return async (dispatch) => {
        console.log(`Liked: ${screamId}`);
        Axios.get(`/scream/${screamId}/like`)
            .then(res => dispatch(likeScream({screamId, ...res.data})))
            .catch(err => console.log(err));
    };
};

// Unlike a scream
export const unlikeScreamId: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction>> = (screamId: string) => {
    return async (dispatch) => {
        console.log(`Unliked: ${screamId}`);
        Axios.get(`/scream/${screamId}/unlike`)
            .then(res => dispatch(unlikeScream({screamId, ...res.data})))
            .catch(err => console.log(err));
    };
};