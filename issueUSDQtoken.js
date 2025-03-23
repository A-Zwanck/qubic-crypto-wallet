import { QubicTransaction } from "@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction.js";

// Base URL for testnet RPC
const baseURL = 'https://testnet-rpc.qubic.org';

// Constants from the QX contract source code
const QX_CONTRACT_INDEX = 1;
const QX_ISSUE_ASSET = 1;
const QX_ADDRESS = "BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARMID";
const ASSET_ISSUANCE_FEE = 1000000000; // 1 QUBIC
const TICK_OFFSET = 20;

/**
 * Function to get current RPC status
 * @returns {Promise<Object>} RPC status including current tick
 */
async function getRPCStatus() {
    const response = await fetch(baseURL + "/v1/status");
    if (!response.ok) throw new Error("Failed to fetch RPC status");
    return await response.json();
}

/**
 * Function to broadcast a transaction to the Qubic network
 * @param {QubicTransaction} transaction - The transaction to broadcast
 * @returns {Promise<Response>} Fetch response
 */
async function broadcastTransaction(transaction) {
    const encodedTransaction = transaction.encodeTransactionToBase64(transaction.getPackageData());
    const response = await fetch(baseURL + "/v1/broadcast-transaction", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ encodedTransaction })
    });
    return response;
}

/**
 * Convert a string to a fixed-length byte array
 * @param {string} str - String to convert
 * @param {number} length - Fixed length
 * @returns {Uint8Array} Fixed length array
 */
function stringToFixedArray(str, length) {
    const buffer = new Uint8Array(length);
    const encoder = new TextEncoder();
    const strBytes = encoder.encode(str);
    const bytesToCopy = Math.min(strBytes.length, length);
    for (let i = 0; i < bytesToCopy; i++) {
        buffer[i] = strBytes[i];
    }
    return buffer;
}

/**
 * Issue a new asset via the QX smart contract
 * @param {string} sourceSeed - Your private seed
 * @param {string} sourceId - Your Qubic ID
 * @param {string} assetName - Name of the asset to create (max 8 chars)
 * @param {number|string} numberOfUnits - Amount of units to issue
 * @param {string} unitOfMeasurement - Unit symbol (max 8 chars)
 * @param {number} numDecimals - Number of decimal places (0-255)
 * @param {boolean} [debug=false] - Enable debug logging
 * @returns {Promise<void>}
 */
export async function qxIssueAsset(
    sourceSeed,
    sourceId,
    assetName,
    numberOfUnits,
    unitOfMeasurement,
    numDecimals,
    debug = false
) {
    try {
        // Validate inputs
        if (assetName.length > 8) throw new Error("Asset name must be 8 characters or less");
        if (unitOfMeasurement.length > 8) throw new Error("Unit of measurement must be 8 characters or less");
        if (numDecimals < 0 || numDecimals > 255) throw new Error("Number of decimals must be between 0 and 255");
        if (sourceId.length !== 60) throw new Error("Source ID must be 55 characters");

        let units;
        try {
            units = BigInt(numberOfUnits);
        } catch (e) {
            throw new Error("numberOfUnits must be a valid integer");
        }

        // Get current network status
        const rpcStatus = await getRPCStatus();
        const currentTick = rpcStatus.lastProcessedTick.tickNumber;
        const targetTick = currentTick + TICK_OFFSET;

        // Create byte arrays for asset name and unit of measurement
        const assetNameArray = stringToFixedArray(assetName, 8);
        const unitArray = stringToFixedArray(unitOfMeasurement, 8);

        // Create buffer for IssueAsset_input (25 bytes)
        // - 0-7: assetName (8 bytes)
        // - 8-15: unitOfMeasurement (8 bytes)
        // - 16-23: numberOfUnits (8 bytes, little-endian)
        // - 24: numDecimals (1 byte)
        const buffer = new ArrayBuffer(25);
        const view = new DataView(buffer);

        for (let i = 0; i < 8; i++) view.setUint8(i, assetNameArray[i]);
        for (let i = 0; i < 8; i++) view.setUint8(i + 8, unitArray[i]);
        view.setBigUint64(16, units, true);
        view.setUint8(24, numDecimals);

        if (debug) {
            console.log("Buffer contents:", new Uint8Array(buffer));
        }

        // Create transaction
        const tx = new QubicTransaction()
            .setSourcePublicKey(sourceId)
            .setDestinationPublicKey(QX_ADDRESS)
            .setAmount(ASSET_ISSUANCE_FEE) // 1 QUBIC fee for asset issuance
            .setTick(targetTick)
            //.setTxType(3) // Contract interaction
            //.setExtraDataWithContractInput(QX_CONTRACT_INDEX, QX_ISSUE_ASSET, new Uint8Array(buffer));

        // Sign the transaction
        await tx.build(sourceSeed);

        // Broadcast the transaction
        const response = await broadcastTransaction(tx);
        const responseData = await response.json();

        if (!response.ok) {
            console.error("Failed to issue asset:", responseData);
            return;
        }

        console.log("Successfully issued asset.");
        console.log("Transaction ID:", responseData.transactionId || "Not provided");
        console.log("Asset Name:", assetName);
        console.log("Units:", numberOfUnits);
        console.log("Unit of Measurement:", unitOfMeasurement);
        console.log("Decimals:", numDecimals);
        console.log("Scheduled for tick:", targetTick);
        console.log("Response data:", responseData);
        console.log("To check tx status, run:");
        console.log(`./qubic-cli -nodeip <IP> -nodeport <PORT> -checktxontick ${targetTick} ${responseData.transactionId || '<txId>'}`);

    } catch (error) {
        console.error("Error issuing asset:", error);
    }
}

// Example usage
async function main() {
    const sourceSeed = 'zwoggmzfbdhuxrikdhqrmcxaqmpmdblgsdjzlesfnyogxquwzutracm';
    const sourceId = 'CZCHJOVMPLVYZCJJXWCYZNOLUQLBZCVUDHGKIDAPQEJYBMCTYETVOLADTWJI';
    const assetName = "QubicUSD";
    const numberOfUnits = 2000;
    const unitOfMeasurement = "USDQ";
    const numDecimals = 6;

    await qxIssueAsset(sourceSeed, sourceId, assetName, numberOfUnits, unitOfMeasurement, numDecimals, true); // Debug mode on
}

main().catch(console.error);