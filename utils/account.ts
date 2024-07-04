import "dotenv/config";

export function account(accName: string): string {
    if(!accName) {
        throw new Error("network can not be empty");
    }

    let key = process.env["MAIN_ACCOUNT_" + accName.toUpperCase()];
    if (key && key !== "") {
        return key;
    } else {
        throw new Error("invalid account");
    }
}

export function testAccount(accName: string): string {
    if(!accName) {
        throw new Error("network can not be empty");
    }

    let key = process.env["TEST_ACCOUNT_" + accName.toUpperCase()];
    if (key && key !== "") {
        return key;
    } else {
        throw new Error("invalid account");
    }
}