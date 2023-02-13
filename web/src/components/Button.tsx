import { Contract, ethers } from "ethers";
import React, { Dispatch, MouseEventHandler, SetStateAction } from "react";

interface ButtonProps {
    callBack: Function;
    title: string;
    contract: Contract | undefined;
    setState?: Dispatch<SetStateAction<any>>;
    provider?: ethers.providers.Web3Provider;
}


const Button = ({ callBack, title, contract, setState, provider }: ButtonProps) => {
    const handleClick = (event: React.MouseEvent<Element>) => {
        event.preventDefault();
        callBack(contract, provider, setState);
    }

    return (
        <button onClick={handleClick} > {title} </button>

    );
};

export default Button;