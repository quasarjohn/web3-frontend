const connectButton = document.getElementById("connectButton");
const walletID = document.getElementById("walletID");
const verifierFactoryAddress = "0x0F3Ca67474baF5D896F337e237A017977DC0e19D";
const factoryAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "documentHash",
        type: "string",
      },
    ],
    name: "createDocument",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "documentId",
        type: "string",
      },
    ],
    name: "getDocument",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

alert(Object.keys(hash));

const documentAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "_documentHash",
        type: "string",
      },
      {
        internalType: "address",
        name: "_signer",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "documentHash",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "signDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "signer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

let verifierFactoryContract;
let activeAccount;
let web3;

// check if there's connection to wallet
if (typeof window.ethereum !== "undefined") {
  ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
    const account = accounts[0];
    activeAccount = accounts[0];
    web3 = new Web3(window.ethereum);

    // make instance of the factory contract
    verifierFactoryContract = new web3.eth.Contract(
      factoryAbi,
      verifierFactoryAddress
    );

    walletID.innerHTML = `Wallet connected: ${account}`;
  });
} else {
  window.open("https://metamask.io/download/", "_blank");
}

// helper function for sending transactions
function sendTransaction(tx) {
  return new Promise(async (resolve, reject) => {
    try {
      let opts = {
        from: await activeAccount,
      };

      let gas = await tx.estimateGas(opts);
      let gasPrice = await web3.eth.getGasPrice();

      //@ts-ignore
      opts.gas = gas;
      //@ts-ignore
      opts.gasPrice = gasPrice;
      await tx.send(opts);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

document.getElementById("addDocument").addEventListener("click", async () => {
  const docHash = document.getElementById("documentHash").value;

  // create new document and save to blockchain
  const transaction = verifierFactoryContract.methods.createDocument(
    "0xE3F687CfCcAA0B069D5958edEE4E9a6742580Ed8",
    docHash
  );

  await sendTransaction(transaction);
});

document.getElementById("getDocument").addEventListener("click", async () => {
  const docHash = document.getElementById("documentHash").value;

  // get the document address
  const documentAddress = await verifierFactoryContract.methods
    .getDocument(docHash)
    .call();

  // make instance of the document smart contract
  const documentVerifier = new web3.eth.Contract(documentAbi, documentAddress);

  // get the owner
  const documentOwner = await documentVerifier.methods.owner().call();

  alert(documentOwner);
});
