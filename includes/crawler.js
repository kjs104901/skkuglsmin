const request = require('request');

/* -------------- Requests -------------- */
let cookieJar = request.jar();

const normalHeader = {
    "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
};

let targetStr = "";

exports.setTargetStr = (newStr) => {
    targetStr = newStr;
};

exports.getTargetStr = () => {
    return targetStr;
};

exports.getBetweenMoveTarget = (startStr, endStr) => {
    const startIndex = targetStr.indexOf(startStr);
    if (startIndex === -1) {
        return "";
    }
    const endIndex = targetStr.indexOf(endStr, startIndex + startStr.length);
    if (endIndex === -1) {
        return "";
    }
    let returnStr = targetStr.substring(startIndex + startStr.length, endIndex);
    targetStr = targetStr.substring(endIndex + endStr.length);

    return returnStr;
}

exports.getBetween = (startStr, endStr) => {
    const startIndex = targetStr.indexOf(startStr);
    if (startIndex === -1) {
        return "";
    }
    const endIndex = targetStr.indexOf(endStr, startIndex + startStr.length);
    if (endIndex === -1) {
        return "";
    }
    let returnStr = targetStr.substring(startIndex + startStr.length, endIndex);
    return returnStr;
}

exports.moveTargetAfter = (endStr) => {
    const endIndex = targetStr.indexOf(endStr);
    if (endIndex === -1) {
        return false;
    }
    targetStr = targetStr.substring(endIndex + endStr.length);
    return true;
}

exports.getNormalHeader = () => {
    return normalHeader;
}

exports.getCookieJar = () => {
    return cookieJar;
}