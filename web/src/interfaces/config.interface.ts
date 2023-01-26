interface Config {
    "31337": {
        "WalletProj": {
            "address": string;
        }
    }
}

const config: Config = require('../config.json');

export { config };