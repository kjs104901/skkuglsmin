const portal = require('./includes/portal');
const gls = require('./includes/gls');

if (process.argv.length < 3 || process.argv.length > 4) {
    console.error("Usage: node index.js [User ID] [User Password]");
    return;
}

if (!gls.checkInstalled()) {
    console.error("[Error] MiPlatform - not installed");
    return;
}
gls.setImage();

const userId = process.argv[2];
const userPass = process.argv[3];

portal.login(userId, userPass)
    .then(async result => await portal.getGlobalVal())
    .then(globalVal => gls.setGlobalVal(globalVal))
    .then(() => gls.executeGLS())
    .then(result => {
        if (result) {
            console.log("Success");
        } else {
            console.error("[Error] GLS - failed");
        }
    })
    .catch(err => {
        console.error("[Error] Login - failed");
        console.log(err);
    })