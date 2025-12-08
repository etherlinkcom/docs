---
title: Create the frontend application
dependencies:
  vite: 0
  viem: 0
---

`Deno` is not mandatory as you can still use `npm`, but we use it on this tutorial. You can install it with [this link](https://docs.deno.com/runtime/getting_started/installation/)

1. Create a frontend app on the same project root directory. Here we use `Vite` and `React` to start a default project;

   ```bash
   deno run -A npm:create-vite@latest
   ```

   If you have trouble with Deno, as on some Mac computers, you can create a non-deno project that works in a similar way by running this command: `npm create vite@latest`.

1. Choose a name for the frontend project (such as `app`, which is what the examples later use), select the `React` framework, and select the `Typescript` language.

1. Copy the images from the folder https://github.com/trilitech/tutorial-applications/tree/main/etherlink-marketpulse/app/public/ to the `app/public` folder of your application.

1. Run the commands as in this example to install the dependencies and start the server:

   ```bash
   cd app
   npm install
   npm run dev
   ```

   Now the Deno or Vite server is running a starter frontend application.

1. Stop the application.

1. Within your frontend `./app` project, import the `Viem` library for blockchain interactions, `thirdweb` for the wallet connection and `bignumber` for calculations on large numbers:

   ```bash
   npm i viem thirdweb bignumber.js
   ```

1. Add the `typechain` library to generate your contract structures and Typescript ABI classes from your ABI json file, that is your smart contract descriptor:

   ```bash
   npm i -D typechain @typechain/ethers-v6
   ```

1. Add this line to the `scripts` section of the `./app/package.json` file in the frontend application:

   ```json
        "postinstall": "cp ../ignition/deployments/chain-127823/deployed_addresses.json ./src  &&  typechain --target=ethers-v6 --out-dir=./src/typechain-types --show-stack-traces ../artifacts/contracts/Marketpulse.sol/Marketpulse.json",
   ```

   This script copies the output address of the last deployed contract into your source files and calls `typechain` to generate types from the ABI file from the Hardhat folders.

1. Run `npm i` to call the postinstall script automatically. You should see new files and folders in the `./src` folder of the frontend application.

1. Create an utility file to manage Viem errors. Better than the technical defaults and not helpful ones

   ```bash
   touch src/DecodeEvmTransactionLogsArgs.ts
   ```

1. Put this code in the `./app/src/DecodeEvmTransactionLogsArgs.ts` file:

   ```Typescript
   import {
   Abi,
   BaseError,
   ContractFunctionRevertedError,
   decodeErrorResult,
   } from "viem";

   // Type-Safe Error Handling Interface
   interface DetailedError {
   type: "DecodedError" | "RawError" | "UnknownError";
   message: string;
   details?: string;
   errorData?: any;
   }

   // Advanced Error Extraction Function
   export function extractErrorDetails(error: unknown, abi: Abi): DetailedError {
   // Type guard for BaseError
   if (error instanceof BaseError) {
       // Type guard for ContractFunctionRevertedError
       if (error.walk() instanceof ContractFunctionRevertedError) {
       try {
           // Safe data extraction
           const revertError = error.walk() as ContractFunctionRevertedError;

           // Extract error data safely
           const errorData = (revertError as any).data;

           // Attempt to decode error
           if (errorData) {
           try {
               // Generic error ABI for decoding
               const errorAbi = abi;

               const decodedError = decodeErrorResult({
               abi: errorAbi,
               data: errorData,
               });

               return {
               type: "DecodedError",
               message: decodedError.errorName || "Contract function reverted",
               details: decodedError.args?.toString(),
               errorData,
               };
           } catch {
               // Fallback if decoding fails
               return {
               type: "RawError",
               message: "Could not decode error",
               errorData,
               };
           }
           }
       } catch (extractionError) {
           // Fallback error extraction
           return {
           type: "UnknownError",
           message: error.shortMessage || "Unknown contract error",
           details: error.message,
           };
       }
       }

       // Generic BaseError handling
       return {
       type: "RawError",
       message: error.shortMessage || "Base error occurred",
       details: error.message,
       };
   }

   // Fallback for non-BaseError
   return {
       type: "UnknownError",
       message: "message" in (error as any) ? (error as any).message : String(error),
       details: error instanceof Error ? error.message : undefined,
   };
   }

   ```

1. Edit `./app/src/main.tsx` to add a `Thirdweb` provider around your application. In the following example, replace **line 7** `<THIRDWEB_CLIENTID>` with your own `clientId` configured on the [Thirdweb dashboard here](https://portal.thirdweb.com/typescript/v4/getting-started#initialize-the-sdk):

   ```Typescript
   import { createRoot } from "react-dom/client";
   import { createThirdwebClient } from "thirdweb";
   import { ThirdwebProvider } from "thirdweb/react";
   import App from "./App.tsx";
   import "./index.css";

   const client = createThirdwebClient({
   clientId: "<THIRDWEB_CLIENTID>",
   });

   createRoot(document.getElementById("root")!).render(
   <ThirdwebProvider>
       <App thirdwebClient={client} />
   </ThirdwebProvider>
   );
   ```

   ThirdwebProvider encapsulates your application to inject account context and wrapped Viem functions

1. Edit `./app/src/App.tsx` to have this code:

   ```TypeScript
   import { Marketpulse, Marketpulse__factory } from "./typechain-types";

   import BigNumber from "bignumber.js";
   import { useEffect, useState } from "react";
   import "./App.css";

   import {
     defineChain,
     getContract,
     prepareContractCall,
     readContract,
     sendTransaction,
     ThirdwebClient,
     waitForReceipt,
   } from "thirdweb";
   import { ConnectButton, useActiveAccount } from "thirdweb/react";
   import { createWallet, inAppWallet } from "thirdweb/wallets";
   import { parseEther } from "viem";
   import { etherlinkShadownetTestnet } from "viem/chains";
   import { extractErrorDetails } from "./DecodeEvmTransactionLogsArgs";
   import CONTRACT_ADDRESS_JSON from "./deployed_addresses.json";

   const wallets = [
     inAppWallet({
       auth: {
         options: ["google", "email", "passkey", "phone"],
       },
     }),
     createWallet("io.metamask"),
     createWallet("com.coinbase.wallet"),
     createWallet("io.rabby"),
     createWallet("com.trustwallet.app"),
     createWallet("global.safe"),
   ];

   //copy pasta from Solidity code as Abi and Typechain does not export enum types
   enum BET_RESULT {
     WIN = 0,
     DRAW = 1,
     PENDING = 2,
   }

   interface AppProps {
     thirdwebClient: ThirdwebClient;
   }

   export default function App({ thirdwebClient }: AppProps) {
     console.log("*************App");

     const marketPulseContract = {
       abi: Marketpulse__factory.abi,
       client: thirdwebClient,
       chain: defineChain(etherlinkShadownetTestnet.id),
       address: CONTRACT_ADDRESS_JSON["MarketpulseModule#Marketpulse"],
     }

     const account = useActiveAccount();

     const [options, setOptions] = useState<Map<string, bigint>>(new Map());

     const [error, setError] = useState<string>("");

     const [status, setStatus] = useState<BET_RESULT>(BET_RESULT.PENDING);
     const [winner, setWinner] = useState<string | undefined>(undefined);
     const [fees, setFees] = useState<number>(0);
     const [betKeys, setBetKeys] = useState<bigint[]>([]);
     const [_bets, setBets] = useState<Marketpulse.BetStruct[]>([]);

     const reload = async () => {
       if (!account?.address) {
         console.log("No address...");
       } else {
         const dataStatus = await readContract({
           contract: getContract(marketPulseContract),
           method: "status",
           params: [],
         });

         const dataWinner = await readContract({
           contract: getContract(marketPulseContract),
           method: "winner",
           params: [],
         });

         const dataFEES = await readContract({
           contract: getContract(marketPulseContract),
           method: "FEES",
           params: [],
         });

         const dataBetKeys = await readContract({
           contract: getContract(marketPulseContract),
           method: "getBetKeys",
           params: [],
         });

         setStatus(dataStatus as unknown as BET_RESULT);
         setWinner(dataWinner as unknown as string);
         setFees(Number(dataFEES as unknown as bigint) / 100);
         setBetKeys(dataBetKeys as unknown as bigint[]);

         console.log(
           "**********status, winner, fees, betKeys",
           status,
           winner,
           fees,
           betKeys
         );
       }
     };

     //first call to load data
     useEffect(() => {
       (() => reload())();
     }, [account?.address]);

     //fetch bets

     useEffect(() => {
       (async () => {
         if (!betKeys || betKeys.length === 0) {
           console.log("no dataBetKeys");
           setBets([]);
         } else {
           const bets = await Promise.all(
             betKeys.map(
               async (betKey) =>
                 (await readContract({
                   contract: getContract(marketPulseContract),
                   method: "getBets",
                   params: [betKey],
                 })) as unknown as Marketpulse.BetStruct
             )
           );
           setBets(bets);

           //fetch options
           let newOptions = new Map();
           setOptions(newOptions);
           bets.forEach((bet) => {
             if (newOptions.has(bet!.option)) {
               newOptions.set(
                 bet!.option,
                 newOptions.get(bet!.option)! + bet!.amount
               ); //acc
             } else {
               newOptions.set(bet!.option, bet!.amount);
             }
           });
           setOptions(newOptions);
           console.log("options", newOptions);
         }
       })();
     }, [betKeys]);

     const Ping = () => {
       // Comprehensive error handling
       const handlePing = async () => {
         try {
           const preparedContractCall = await prepareContractCall({
             contract: getContract(marketPulseContract),
             method: "ping",
             params: [],
           });

           console.log("preparedContractCall", preparedContractCall);

           const transaction = await sendTransaction({
             transaction: preparedContractCall,
             account: account!,
           });

           //wait for tx to be included on a block
           const receipt = await waitForReceipt({
             client: thirdwebClient,
             chain: defineChain(etherlinkShadownetTestnet.id),
             transactionHash: transaction.transactionHash,
           });

           console.log("receipt:", receipt);

           setError("");
         } catch (error) {
           const errorParsed = extractErrorDetails(
             error,
             Marketpulse__factory.abi
           );
           setError(errorParsed.message);
         }
       };

       return (
         <span style={{ alignContent: "center", paddingLeft: 100 }}>
           <button onClick={handlePing}>Ping</button>
           {!error || error === "" ? <>&#128994;</> : <>&#128308;</>}
         </span>
       );
     };

     const BetFunction = () => {
       const [amount, setAmount] = useState<BigNumber>(BigNumber(0)); //in Ether decimals
       const [option, setOption] = useState("chiefs");

       const runFunction = async () => {
         try {
           const contract = getContract(marketPulseContract);

           const preparedContractCall = await prepareContractCall({
             contract,
             method: "bet",
             params: [option, parseEther(amount.toString(10))],
             value: parseEther(amount.toString(10)),
           });

           const transaction = await sendTransaction({
             transaction: preparedContractCall,
             account: account!,
           });

           //wait for tx to be included on a block
           const receipt = await waitForReceipt({
             client: thirdwebClient,
             chain: defineChain(etherlinkShadownetTestnet.id),
             transactionHash: transaction.transactionHash,
           });

           console.log("receipt:", receipt);

           await reload();

           setError("");
         } catch (error) {
           const errorParsed = extractErrorDetails(
             error,
             Marketpulse__factory.abi
           );
           console.log("ERROR", error);
           setError(errorParsed.message);
         }
       };

       const calculateOdds = (option: string, amount?: bigint): BigNumber => {
         //check option exists
         if (!options.has(option)) return new BigNumber(0);

         console.log(
           "actuel",
           options && options.size > 0
             ? new BigNumber(options.get(option)!.toString()).toString()
             : 0,
           "total",
           new BigNumber(
             [...options.values()]
               .reduce((acc, newValue) => acc + newValue, amount ? amount : 0n)
               .toString()
           ).toString()
         );

         return options && options.size > 0
           ? new BigNumber(options.get(option)!.toString(10))
               .plus(
                 amount ? new BigNumber(amount.toString(10)) : new BigNumber(0)
               )
               .div(
                 new BigNumber(
                   [...options.values()]
                     .reduce(
                       (acc, newValue) => acc + newValue,
                       amount ? amount : 0n
                     )
                     .toString(10)
                 )
               )
               .plus(1)
               .minus(fees)
           : new BigNumber(0);
       };

       return (
         <span style={{ alignContent: "center", width: "100%" }}>
           {status && status === BET_RESULT.PENDING ? (
             <>
               <h3>Choose team</h3>

               <select
                 name="options"
                 onChange={(e) => setOption(e.target.value)}
                 value={option}
               >
                 <option value="chiefs"> Chiefs</option>
                 <option value="lions">Lions </option>
               </select>
               <h3>Amount</h3>
               <input
                 type="number"
                 id="amount"
                 name="amount"
                 required
                 onChange={(e) => {
                   if (e.target.value && !isNaN(Number(e.target.value))) {
                     //console.log("e.target.value",e.target.value)
                     setAmount(new BigNumber(e.target.value));
                   }
                 }}
               />

               <hr />
               {account?.address ? <button onClick={runFunction}>Bet</button> : ""}

               <table style={{ fontWeight: "normal", width: "100%" }}>
                 <tbody>
                   <tr>
                     <td style={{ textAlign: "left" }}>Avg price (decimal)</td>
                     <td style={{ textAlign: "right" }}>
                       {options && options.size > 0
                         ? calculateOdds(option, parseEther(amount.toString(10)))
                             .toFixed(3)
                             .toString()
                         : 0}
                     </td>
                   </tr>

                   <tr>
                     <td style={{ textAlign: "left" }}>Potential return</td>
                     <td style={{ textAlign: "right" }}>
                       XTZ{" "}
                       {amount
                         ? calculateOdds(option, parseEther(amount.toString(10)))
                             .multipliedBy(amount)
                             .toFixed(6)
                             .toString()
                         : 0}{" "}
                       (
                       {options && options.size > 0
                         ? calculateOdds(option, parseEther(amount.toString(10)))
                             .minus(new BigNumber(1))
                             .multipliedBy(100)
                             .toFixed(2)
                             .toString()
                         : 0}
                       %)
                     </td>
                   </tr>
                 </tbody>
               </table>
             </>
           ) : (
             <>
               <span style={{ color: "#2D9CDB", fontSize: "1.125rem" }}>
                 Outcome: {BET_RESULT[status]}
               </span>
               {winner ? <div style={{ color: "#858D92" }}>{winner}</div> : ""}
             </>
           )}
         </span>
       );
     };

     const resolve = async (option: string) => {
       try {
         const preparedContractCall = await prepareContractCall({
           contract: getContract(marketPulseContract),
           method: "resolveResult",
           params: [option, BET_RESULT.WIN],
         });

         console.log("preparedContractCall", preparedContractCall);

         const transaction = await sendTransaction({
           transaction: preparedContractCall,
           account: account!,
         });

         //wait for tx to be included on a block
         const receipt = await waitForReceipt({
           client: thirdwebClient,
           chain: defineChain(etherlinkShadownetTestnet.id),
           transactionHash: transaction.transactionHash,
         });

         console.log("receipt:", receipt);

         await reload();

         setError("");
       } catch (error) {
         const errorParsed = extractErrorDetails(error, Marketpulse__factory.abi);
         setError(errorParsed.message);
       }
     };

     return (
       <>
         <header>
           <span style={{ display: "flex" }}>
             <h1>Market Pulse</h1>

             <div className="flex items-center gap-4">
               <ConnectButton
                 client={thirdwebClient}
                 wallets={wallets}
                 connectModal={{ size: "compact" }}
                 chain={defineChain(etherlinkShadownetTestnet.id)}
               />
             </div>
           </span>
         </header>

         <div id="content" style={{ display: "flex", paddingTop: 10 }}>
           <div style={{ width: "calc(66vw - 4rem)" }}>
             <img
               style={{ maxHeight: "40vh" }}
               src="https://zamrokk.github.io/marketpulse/images/graph.png"
             />
             <hr />

             <table style={{ width: "inherit" }}>
               <thead>
                 <tr>
                   <th>Outcome</th>
                   <th>% chance</th>
                   <th>action</th>
                 </tr>
               </thead>
               <tbody>
                 {options && options.size > 0 ? (
                   [...options.entries()].map(([option, amount]) => (
                     <tr key={option}>
                       <td className="tdTable">
                         <div className="picDiv">
                           <img
                             style={{ objectFit: "cover", height: "inherit" }}
                             src={
                               "https://zamrokk.github.io/marketpulse/images/" +
                               option +
                               ".png"
                             }
                           ></img>
                         </div>
                         {option}
                       </td>
                       <td>
                         {new BigNumber(amount.toString())
                           .div(
                             new BigNumber(
                               [...options.values()]
                                 .reduce((acc, newValue) => acc + newValue, 0n)
                                 .toString()
                             )
                           )
                           .multipliedBy(100)
                           .toFixed(2)}
                         %
                       </td>

                       <td>
                         {status && status === BET_RESULT.PENDING ? (
                           <button onClick={() => resolve(option)}>Winner</button>
                         ) : (
                           ""
                         )}
                       </td>
                     </tr>
                   ))
                 ) : (
                   <></>
                 )}
               </tbody>
             </table>
           </div>

           <div
             style={{
               width: "calc(33vw - 4rem)",
               boxShadow: "",
               margin: "1rem",
               borderRadius: "12px",
               border: "1px solid #344452",
               padding: "1rem",
             }}
           >
             <span className="tdTable">{<BetFunction />}</span>
           </div>
         </div>

         <footer>
           <h3>Errors</h3>

           <textarea
             readOnly
             rows={10}
             style={{ width: "100%" }}
             value={error}
           ></textarea>

           {account?.address ? <Ping /> : ""}
         </footer>
       </>
     );
   }
   ```

   Explanations:

   - `import { Marketpulse, Marketpulse__factory } from "./typechain-types";`: Imports the contract ABI and contract structures
   - `import CONTRACT_ADDRESS_JSON from "./deployed_addresses.json";`: Imports the address of the last deployed contract automatically
   - `const wallets = [inAppWallet(...),createWallet(...)}`: Configures the Thirdweb wallet connection. Look at the [Thirdweb playground](https://playground.thirdweb.com/connect/sign-in/button?tab=code) and play with the generator.
   - `useActiveAccount`: Uses Thirdweb React hooks and functions as a wrapper over the Viem library to get the active account.
   - `const reload = async () => {`: Refreshes the smart contract storage (status, winner, fees and mapping keys).
   - `useEffect...[betKeys]);`: React effect that reloads all bets from the storage when `betKeys` is updated.
   - `const Ping = () => {`: Checks that the smart contract interaction works. It can be removed in production deployments.
   - `const BetFunction = () => {`: Sends your bet to the smart contract, passing along the correct amount of XTZ.
   - `const calculateOdds = (option: string, amount?: bigint): BigNumber => {`: Calculates the odds, similar to the onchain function in the smart contract.

1. To fix the CSS for the page styling, replace the `./app/src/App.css` file with this code:

   ```css
   #root {
     margin: 0 auto;
     padding: 2rem;
     text-align: center;

     width: 100vw;
     height: calc(100vh - 4rem);
   }

   .logo {
     height: 6em;
     padding: 1.5em;
     will-change: filter;
     transition: filter 300ms;
   }

   .logo:hover {
     filter: drop-shadow(0 0 2em #646cffaa);
   }

   .logo.react:hover {
     filter: drop-shadow(0 0 2em #61dafbaa);
   }

   @keyframes logo-spin {
     from {
       transform: rotate(0deg);
     }

     to {
       transform: rotate(360deg);
     }
   }

   @media (prefers-reduced-motion: no-preference) {
     a:nth-of-type(2) .logo {
       animation: logo-spin infinite 20s linear;
     }
   }

   header {
     border-bottom: 1px solid #2c3f4f;
     height: 100px;
   }

   footer {
     border-top: 1px solid #2c3f4f;
   }

   hr {
     color: #2c3f4f;
     height: 1px;
   }

   .tdTable {
     align-items: center;
     gap: 1rem;
     width: 100%;
     flex: 3 1 0%;
     display: flex;
     font-weight: bold;
   }

   .picDiv {
     height: 40px;
     width: 40px;
     min-width: 40px;
     border-radius: 999px;
     position: relative;
     overflow: hidden;
   }

   .card {
     padding: 2em;
   }

   .read-the-docs {
     color: #888;
   }

   h1 {
     margin: unset;
   }
   ```

1. Replace the `./app/src/index.css` file with this code:

   ```css
   :root {
     font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
     line-height: 1.5;
     font-weight: 400;

     color-scheme: light dark;
     color: rgba(255, 255, 255, 0.87);
     background-color: #1D2B39;



     font-synthesis: none;
     text-rendering: optimizeLegibility;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }

   a {
     font-weight: 500;
     color: #646cff;
     text-decoration: inherit;
   }

   a:hover {
     color: #535bf2;
   }

   body {
     margin: 0;
     display: flex;
     place-items: center;
     min-width: 320px;
     min-height: 100vh;

   }

   h1 {
     font-size: 3.2em;
     line-height: 1.1;
   }

   button {
     border-radius: 8px;
     border: 1px solid transparent;
     padding: 0.6em 1.2em;
     font-size: 1em;
     font-weight: 500;
     font-family: inherit;
     background-color: #2D9CDB;
     cursor: pointer;
     transition: border-color 0.25s;
   }

   button:hover {
     border-color: #646cff;
   }

   button:focus,
   button:focus-visible {
     outline: 4px auto -webkit-focus-ring-color;
   }

   select {
     width: inherit;
     font-size: 0.875rem;
     color: #858D92;
     border-color: #344452;
     transition: color 0.2s;
     text-align: center;
     border-width: 1px;
     border-style: solid;
     align-self: center;
     padding: 1rem 1rem;
     background: #1D2B39;
     outline: none;
     outline-color: currentcolor;
     outline-style: none;
     outline-width: medium;
     border-radius: 8px;
   }

   input {
     width: calc(100% - 35px);
     font-size: 0.875rem;
     color: #858D92;
     border-color: #344452;
     transition: color 0.2s;
     text-align: center;
     border-width: 1px;
     border-style: solid;
     align-self: center;
     padding: 1rem 1rem;
     background: #1D2B39;
     outline: none;
     outline-color: currentcolor;
     outline-style: none;
     outline-width: medium;
     border-radius: 8px;
   }

   @media (prefers-color-scheme: light) {
     :root {
       color: #213547;
       background-color: #ffffff;
     }

     a:hover {
       color: #747bff;
     }

     button {
       background-color: #f9f9f9;
     }
   }
   ```

1. Run the application:

   ```bash
   npm run dev
   ```

1. In a web browser, click the **Connect** button to login with your wallet.

1. Click the **Ping** button at the bottom. It should stay green if you can interact with your smart contract with no error messages.

1. Run a betting scenario:

   1. Select **Chiefs** on the select box on the right corner, choose a small amount like **0.00001 XTZ**, and click the **Bet** button.

   1. Confirm the transaction in your wallet.
   If you don't have enough XTZ in your account, the application shows an `OutOfFund` error.

   1. Disconnect and connect with another account in your wallet.

   1. Select **Lions ** on the select box on the right corner, choose a small amount like **0.00001 XTZ**, and click the **Bet** button.

   1. Confirm the transaction in your wallet.

      Both teams have 50% of chance to win. Note: Default platform fees have been set to 10%, and the odds calculation takes those fees into account.

   1. Connect as the account that you deployed the contract with (the admin) and click one of the **Winner** buttons to resolve the poll.

      The page's right-hand corner refreshes and displays the winner of the poll and the application automatically pays the winning bets.

   1. Find your transaction `resolveResult` on the Etherlink Shadownet Testnet explorer at `https://shadownet.explorer.etherlink.com`. In the **Transaction details>Internal txns tab**, you should see, if you won something, the expected amount transferred to you from the smart contract address.
