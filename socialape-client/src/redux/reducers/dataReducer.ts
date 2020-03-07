import {DataAction, DataState, initialState} from "../actions/dataActions";

export default function (state = initialState, action: DataAction): DataState {
    switch(action.type) {
    case "LOADING_DATA":
        return {
            ...state,
            loading: true
        };
    case "SET_SCREAMS":
        return {
            ...state,
            screams: action.payload,
            loading: false
        };
    case "LIKE_SCREAM":
    case "UNLIKE_SCREAM":
        console.log(`dataReducer: ${action.type}, payload=`);
        console.log(action.payload);
        let index = state.screams.findIndex((scream) => scream.screamId===action.payload.screamId);
        state.screams[index] = action.payload;
        console.log(`state.screams[${index}]=`);
        console.log(state.screams[index]);
        return {
            ...state
        };
    default:
        return state;
    }
};