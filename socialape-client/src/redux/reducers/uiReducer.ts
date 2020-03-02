import {initialState, UiState, UiStateAction} from "../actions/uiActions";

export default function (state = initialState, action: UiStateAction): UiState {
    switch (action.type) {
    case "SET_ERRORS":
        return {
            ...state,
            loading: false,
            errors: action.payload
        };
    case "CLEAR_ERRORS":
        return {
            ...state,
            loading: false,
            errors: null
        };
    case "LOADING_UI":
        return {
            ...state,
            loading: true
        };
    case "STOP_LOADING_UI":
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};