import "dotenv/config";

export function rpcNode(network: string): string {
    if(!network) {
        throw new Error("network can not be empty");
    }

    let url = process.env["RPC_NODE_" + network.toUpperCase()];
    if (url && url !== "") {
        return url;
    } else {
        throw new Error("invalid network rpc");
    }

}