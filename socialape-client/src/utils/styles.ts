import {StyleRules} from "@material-ui/styles/withStyles";
import {createStyles} from "@material-ui/core";

export const stylesObj: StyleRules = {
    form: {
        textAlign: "center"
    },
    image: {
        margin: "20px auto 20px auto"
    },
    pageTitle: {
        margin: "10px auto 10px auto"
    },
    textField: {
        margin: "10px auto 10px auto"
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        position: "relative"
    },
    customError: {
        color: "red",
        fontSize: "0.8rem"
    },
    progress: {
        position: "absolute"
    },
};

const styles = createStyles(stylesObj);
export default styles;