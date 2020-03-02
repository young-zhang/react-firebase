import * as React from "react";
import {IconButton, Tooltip} from "@material-ui/core";

interface Props {
    onClick?: any
    tip: string
    btnClassName?: string
    tipClassName?: string
}

const MyButton: React.FunctionComponent<Props> = ({children, onClick, tip, btnClassName, tipClassName}) => {
    return (
        <Tooltip title={tip} className={tipClassName} placement="top">
            <IconButton onClick={onClick} className={btnClassName}>
                {children}
            </IconButton>
        </Tooltip>
    );
};

export default MyButton;