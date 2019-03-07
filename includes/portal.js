const request = require('request');
const crawler = require('./crawler');
const util = require('util');

const requestAsync = util.promisify(request);

exports.login = async (userId, userPwd) => {
    const mainURL = "https://eportal.skku.edu/wps/portal/";

    async function postLoginFormWith(response) {
        if (response.statusCode !== 200) {
            throw false;
        }
        crawler.setTargetStr(response.body);
        crawler.moveTargetAfter("loginContainer");
        const loginURL = "https://eportal.skku.edu" + crawler.getBetween('action="', '"');
        const loginForm = {
            lang: "ko",
            saveid: "on",
            userid: userId,
            password: userPwd
        };

        return await requestAsync({
            url: loginURL,
            headers: crawler.getNormalHeader(),
            method: "POST",
            form: loginForm,
            followAllRedirects: true,
            jar: crawler.getCookieJar()
        })
    }

    async function handleLoginResult(response) {
        if (response.statusCode !== 200) {
            throw false;
        }
        crawler.setTargetStr(response.body);
        studentName = crawler.getBetween('user_kor_name = "', '"');
        if (-1 < response.body.indexOf("user_kor_name")) {
            return true;
        } else if (-1 < response.body.indexOf('location.href = "https://eportal.skku.edu/wps/portal"')) {
            return true;
        } else {
            return false;
        }
    }

    return await requestAsync({
            url: mainURL,
            headers: crawler.getNormalHeader(),
            method: "GET",
            jar: crawler.getCookieJar()
        })
        .then(postLoginFormWith)
        .then(handleLoginResult);
};

exports.loginCheck = (callback) => {
    const loginCheckURL = "https://eportal.skku.edu/wps/portal";

    request({
            url: loginCheckURL,
            headers: crawler.getNormalHeader(),
            method: "GET",
            followAllRedirects: true,
            jar: crawler.getCookieJar()
        },
        (error, response, body) => {
            if (error) {
                callback(false);
            } else if (response.statusCode !== 200) {
                callback(false);
            } else {
                if (-1 < body.indexOf("user_kor_name")) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        }
    );
};

exports.getGlobalVal = (callback) => {
    const GLSURL = "https://eportal.skku.edu/wps/myinfo/glsCall.jsp";
    request({
            url: GLSURL,
            headers: crawler.getNormalHeader(),
            method: "GET",
            jar: crawler.getCookieJar()
        },
        getGlobalValCallback
    );

    function getGlobalValCallback(error, response, body) {
        if (error) {
            callback("");
        } else if (response.statusCode !== 200) {
            callback("");
        } else {
            crawler.setTargetStr(body);
            crawler.moveTargetAfter('name="method"');
            const method = crawler.getBetween('value="', '"');
            crawler.moveTargetAfter('name="param"');
            const param = crawler.getBetween('value="', '"');

            const getGlobalValFinalURL = "https://admin.skku.edu/co/COCOUsrLoginAction.do";
            const getGlobalValFinalForm = {
                method: method,
                param: param
            };

            request({
                    url: getGlobalValFinalURL,
                    headers: crawler.getNormalHeader(),
                    form: getGlobalValFinalForm,
                    method: "POST",
                    jar: crawler.getCookieJar()
                },
                getGlobalValFinalCallback
            );
        }
    }

    function getGlobalValFinalCallback(error, response, body) {
        if (error) {
            callback("");
        } else if (response.statusCode !== 200) {
            callback("");
        } else {
            crawler.setTargetStr(body);
            globalVal = crawler.getBetweenMoveTarget('MiInstaller.GlobalVal = "', '"');
            if (0 < globalVal.length) {
                callback(globalVal);
            } else {
                callback("");
            }
        }
    }
};