const request = require('request');
const crawler = require('./crawler');
const util = require('util');

const requestAsync = util.promisify(request);

exports.login = async (userId, userPwd) => {
    const mainURL = "https://eportal.skku.edu/wps/portal/";

    async function postLoginFormWith(response) {
        if (response.statusCode !== 200) {
            throw "Login Failed";
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
            throw "Login Failed";
        }
        crawler.setTargetStr(response.body);
        studentName = crawler.getBetween('user_kor_name = "', '"');
        if (-1 < response.body.indexOf("user_kor_name")) {
            return true;
        } else if (-1 < response.body.indexOf('location.href = "https://eportal.skku.edu/wps/portal"')) {
            return true;
        } else {
            throw "Login Failed";
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

exports.loginCheck = () => {
    const loginCheckURL = "https://eportal.skku.edu/wps/portal";

    return requestAsync({
            url: loginCheckURL,
            headers: crawler.getNormalHeader(),
            method: "GET",
            followAllRedirects: true,
            jar: crawler.getCookieJar()
        })
        .then(response => {
            if ((response.statusCode == 200) && (-1 < response.body.indexOf("user_kor_name")))
                return true;
            else
                throw "Login Failed";
        })
};

exports.getGlobalVal = () => {
    const GLSURL = "https://eportal.skku.edu/wps/myinfo/glsCall.jsp";
    return requestAsync({
            url: GLSURL,
            headers: crawler.getNormalHeader(),
            method: "GET",
            jar: crawler.getCookieJar()
        })
        .then(getGlobalValCallback)
        .then(getGlobalValFinalCallback)

    async function getGlobalValCallback(response) {
        if (response.statusCode !== 200) {
            throw "Login Failed";
        }

        crawler.setTargetStr(response.body);
        crawler.moveTargetAfter('name="method"');
        const method = crawler.getBetween('value="', '"');
        crawler.moveTargetAfter('name="param"');
        const param = crawler.getBetween('value="', '"');

        const getGlobalValFinalURL = "https://admin.skku.edu/co/COCOUsrLoginAction.do";
        const getGlobalValFinalForm = {
            method: method,
            param: param
        };

        return await requestAsync({
            url: getGlobalValFinalURL,
            headers: crawler.getNormalHeader(),
            form: getGlobalValFinalForm,
            method: "POST",
            jar: crawler.getCookieJar()
        });

    }

    function getGlobalValFinalCallback(response) {
        if (response.statusCode !== 200) {
            throw "Login Failed";
        } else {
            crawler.setTargetStr(response.body);
            globalVal = crawler.getBetweenMoveTarget('MiInstaller.GlobalVal = "', '"');
            if (0 < globalVal.length) {
                return globalVal;
            } else {
                throw "Login Failed";
            }
        }
    }
};