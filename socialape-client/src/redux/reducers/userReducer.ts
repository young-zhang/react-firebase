import {initialState, UserStateAction} from "../actions/userActions";

export default function (state = initialState, action: UserStateAction) {
    switch (action.type) {
    case "SET_AUTHENTICATED":
        return {
            ...state,
            authenticated: true
        };
    case "SET_UNAUTHENTICATED":
        return initialState;
    case "SET_USER":
        return {
            authenticated: true,
            loading: false,
            ...action.payload
        };
    case "LOADING_USER":
        return {
            ...state,
            loading: true
        };
    case "LIKE_SCREAM":
        console.log("userReducer: LIKE_SCREAM");
        return {
            ...state,
            likes: [
                ...state.likes,
                {
                    userHandle: state.credentials.handle,
                    screamId: action.payload.screamId
                }
            ]
        };
    case "UNLIKE_SCREAM":
        console.log("userReducer: UNLIKE_SCREAM");
        return {
            ...state,
            likes: state.likes.filter(like => like.screamId !== action.payload.screamId)
        };
    default:
        return state;
    }
};