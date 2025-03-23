// 2-rpc-status.js
const baseURL = 'https://testnet-rpc.qubic.org';

/**
 * Function to get current RPC status
 * @returns {Promise<Object>} RPC status including current tick
 */
export async function getRPCStatus() {
    const response = await fetch(baseURL + "/v1/status");
    if (!response.ok) throw new Error("Failed to fetch RPC status");
    return await response.json();
}