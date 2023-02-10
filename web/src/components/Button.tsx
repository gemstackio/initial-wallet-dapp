import { Contract } from "ethers";
import React, { Dispatch, MouseEventHandler, SetStateAction } from "react";

interface ButtonProps {
    callBack: Function;
    title: string;
    contract: Contract | undefined;
    setState?: Dispatch<SetStateAction<any>>;
}


const Button = ({ callBack, title, contract, setState }: ButtonProps) => {
    const handleClick = (event: React.MouseEvent<Element>) => {
        event.preventDefault();
        callBack(contract, setState);
    }

    console.log("render")
    return (
        <button onClick={handleClick} > {title} </button>

    );
};

export default Button;