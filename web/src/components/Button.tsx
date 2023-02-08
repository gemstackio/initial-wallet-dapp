import { MouseEventHandler } from "react";

interface ButtonProps {
    callBack: MouseEventHandler;
    title: string;
}

const Button = ({ callBack, title }: ButtonProps) => {
    return (
        <button onClick={callBack} > {title} </button>

    );
};

export default Button;