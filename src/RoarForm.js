import React, { useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { InputFacet__factory } from "@cartesi/rollups";
import { Input, Button, useToast } from "@chakra-ui/react";
import "./App.css";

// This is the mnemonic for the Hardhat's first account. If you wish test our DApp on MUMBAI, you should! Just replace this mnemonic and DApp address following the instructions on the README.
const HARDHAT_DEFAULT_MNEMONIC =
    "test test test test test test test test test test test junk";
const HARDHAT_LOCALHOST_RPC_URL = "http://localhost:8545";
const LOCALHOST_DAPP_ADDRESS = "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A";

// This Component presents an Input field and adds its contents as an Input for the Echo DApp
function RoarForm() {
    const [value, setValue] = useState("");
    const [accountIndex] = useState(0);
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        const sendInput = async () => {
            setLoading(true);
            // Start a connection
            const provider = new JsonRpcProvider(HARDHAT_LOCALHOST_RPC_URL);
            const signer = ethers.Wallet.fromMnemonic(
                HARDHAT_DEFAULT_MNEMONIC,
                `m/44'/60'/0'/0/${accountIndex}`
            ).connect(provider);

            // Instantiate the Input Contract
            const inputContract = InputFacet__factory.connect(
                LOCALHOST_DAPP_ADDRESS,
                signer
            );

            // Encode the input
            const inputBytes = ethers.utils.isBytesLike(value)
                ? value
                : ethers.utils.toUtf8Bytes(value);

            // Send the transaction
            const tx = await inputContract.addInput(inputBytes);
            console.log(`transaction: ${tx.hash}`);
            toast({
                title: "Transaction Sent",
                description: "waiting for confirmation",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top-left",
            });

            // Wait for confirmation
            console.log("waiting for confirmation...");
            const receipt = await tx.wait(1);

            // Search for the InputAdded event
            const event = receipt.events?.find((e) => e.event === "InputAdded");

            setLoading(false);
            toast({
                title: "Transaction Confirmed",
                description: `Input added => epoch : ${event?.args.epochNumber} index: ${event?.args.inputIndex} `,
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top-left",
            });
            console.log(
                `Input added => epoch : ${event?.args.epochNumber} index: ${event?.args.inputIndex} `
            );
        };
        sendInput();
    }

    function handleChange(event) {
        setValue(event.target.value);
    }

    let buttonProps = {};
    if (loading) {
        buttonProps.isLoading = true;
    }
    return (
        <div className="layout">
            <img className="moken" src="logo_moken.jpg" alt="moken" />
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Adicione um Inquilino</p>
                </label>
                <Input
                    type="text"
                    focusBorderColor="gray"
                    size="md"
                    value={value}
                    onChange={handleChange}
                ></Input>
                <Button {...buttonProps} className="action" type="submit" colorScheme="green">
                    Alugar
                </Button>
            </form>
        </div>
    );
}

export default RoarForm;
