import Axios from "axios";
import {Action, ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {Scream} from "../../types";
import {clearErrorAction, loadingUiAction, setErrorAction, UiStateAction} from "./uiActions";

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
export const loadingDataAction: ActionCreator<LoadingDataAction> = () => ({type: "LOADING_DATA"});

export interface SetScreamsAction extends Action<"SET_SCREAMS"> {payload: Scream[]}
export const setScreamsAction: ActionCreator<SetScreamsAction> = (payload: Scream[]) => ({type: "SET_SCREAMS", payload});

export interface PostScreamAction extends Action<"POST_SCREAM"> {payload: Scream}
export const postScreamAction: ActionCreator<PostScreamAction> = (payload: Scream) => ({type: "POST_SCREAM", payload});

export interface LikeScreamAction extends Action<"LIKE_SCREAM"> {payload: Scream}
export const likeScreamAction: ActionCreator<LikeScreamAction> = (scream: Scream) => ({type: "LIKE_SCREAM", payload: scream});

export interface UnlikeScreamAction extends Action<"UNLIKE_SCREAM"> {payload: Scream}
export const unlikeScreamAction: ActionCreator<UnlikeScreamAction> = (scream: Scream) => ({type: "UNLIKE_SCREAM", payload: scream});

export interface DeleteScreamAction extends Action<"DELETE_SCREAM"> {payload: string}
export const deleteScreamAction: ActionCreator<DeleteScreamAction> = (screamId: string) => ({type: "DELETE_SCREAM", payload: screamId});

export type DataAction = LoadingDataAction | SetScreamsAction | PostScreamAction | LikeScreamAction | UnlikeScreamAction | DeleteScreamAction;

// Get all screams
export const getScreams: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction>> = () => {
    return async (dispatch) => {
        // console.log("getScreams");
        dispatch(loadingDataAction());
        Axios.get("/screams")
            .then(res => dispatch(setScreamsAction(res.data)))
            .catch(err => {
                dispatch(setScreamsAction([]));
                console.log(err);
            });
    };
};

// Post a scream
export const postScream: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction | UiStateAction>> = (newScream: Scream) => {
    return async (dispatch) => {
        dispatch(loadingUiAction());
        Axios.post("/scream", newScream)
            .then(res => {
                dispatch(postScreamAction(res.data));
                dispatch(clearErrorAction());
            })
            .catch(err => dispatch(setErrorAction(err.response.data)));
    };
};

// Like a scream
export const likeScream: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction>> = (screamId: string) => {
    return async (dispatch) => {
        // console.log(`Liked: ${screamId}`);
        Axios.get(`/scream/${screamId}/like`)
            .then(res => dispatch(likeScreamAction({screamId, ...res.data})))
            .catch(err => console.log(err));
    };
};

// Unlike a scream
export const unlikeScream: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction>> = (screamId: string) => {
    return async (dispatch) => {
        // console.log(`Unliked: ${screamId}`);
        Axios.get(`/scream/${screamId}/unlike`)
            .then(res => dispatch(unlikeScreamAction({screamId, ...res.data})))
            .catch(err => console.log(err));
    };
};

export const deleteScream: ActionCreator<ThunkAction<Promise<void>, any, undefined, DataAction>> = (screamId: string) => {
    return async (dispatch) => {
        console.log(`Deleting: ${screamId}`);
        Axios.delete(`/scream/${screamId}`)
            .then(res => dispatch(deleteScreamAction(screamId)))
            .catch(err => console.log(err));
    };
};

export const clearErrors: ActionCreator<ThunkAction<Promise<void>, any, undefined, UiStateAction>> = () => {
    return async (dispatch) => {
        dispatch(clearErrorAction());
    };
};