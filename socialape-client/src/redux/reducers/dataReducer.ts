import {DataAction, DataState, initialState} from "../actions/dataActions";

export default function (state = initialState, action: DataAction): DataState {
    let index: number;
    switch (action.type) {
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
        // console.log(`dataReducer: ${action.type}, payload=`);
        // console.log(action.payload);
        index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
        state.screams[index] = action.payload;
        // console.log(`state.screams[${index}]=`);
        // console.log(state.screams[index]);
        return {
            ...state
        };
    case "DELETE_SCREAM":
        index = state.screams.findIndex(scream => scream.screamId === action.payload);
        state.screams.splice(index, 1);
        return {...state};
    case "POST_SCREAM":
        return {
            ...state,
            screams: [
                action.payload,
                ...state.screams
            ]
        }
    default:
        return state;
    }
};