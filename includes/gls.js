const regedit = require('regedit');
const executor = require('child_process').execFile;
var fs = require('fs');

const ComponentPath =  process.env.APPDATA.split('AppData')[0] + "AppData\\LocalLow\\TOBESOFT\\SKKU\\components\\";
const Resource = ComponentPath + "resource.xml";
const StartImage = ComponentPath + "next_start.gif";
const iconImage = ComponentPath + "icon_next.ico";

const myStartImage = __dirname + "/GLSimg/next_start.gif"
const myIconImage = __dirname + "/GLSimg/icon_next.ico"
const myStartImageCopy = __dirname + "/GLSimg/next_start_c.gif"
const myIconImageCopy = __dirname + "/GLSimg/icon_next_c.ico"

const Width = 1024;
const Height = 768;

const TimeOut = 3600;
const Retry = 0;

const StartXML = "http://admin.skku.edu/co/mp/start.xml";
const UpdateURL = "http://admin.skku.edu/co/jsp/installer/Miplatform320U_20151207/update_vista_config.xml";

const executeFile =  process.env.APPDATA.split('AppData')[0] + "AppData\\Local\\TOBESOFT\\MiPlatform320U\\MiPlatform320U.exe";
const parametersStr = "-K skku -X 'http://admin.skku.edu/co/mp/start.xml' -Wd 1024 -Ht 784";
const parameters = parametersStr.split(" ");

let GlobalVal = "";

exports.setGlobalVal = (gStr, callback) => {
    GlobalVal = gStr;
    
    var valuesToPut = {
        'HKCU\\Software\\AppDataLow\\Software\\TOBESOFT\\MiPlatform320U\\skku': {
            'ComponentPath': {
                value: ComponentPath,
                type: 'REG_SZ'
            },
            'GlobalVal': {
                value: GlobalVal,
                type: 'REG_SZ'
            },
            'Height': {
                value: Height,
                type: 'REG_SZ'
            },
            'Resource': {
                value: Resource,
                type: 'REG_SZ'
            },
            'Retry': {
                value: Retry,
                type: 'REG_DWORD'
            },
            'StartImage': {
                value: StartImage,
                type: 'REG_SZ'
            },
            'StartXML': {
                value: StartXML,
                type: 'REG_SZ'
            },
            'TimeOut': {
                value: TimeOut,
                type: 'REG_DWORD'
            },
            'UpdateURL': {
                value: UpdateURL,
                type: 'REG_SZ'
            },
            'Width': {
                value: Width,
                type: 'REG_SZ'
            }
        }
    }

    regedit.createKey(['HKCU\\Software\\AppDataLow\\Software\\TOBESOFT\\MiPlatform320U\\skku'], (err)=>{
        if (err) {
            callback(false)
        }
        else {
            regedit.putValue(valuesToPut, function(err) {
                if (err) {
                    callback(false);
                }
                else {
                    callback(true);
                }
            });
        }
    });
};

exports.setImage = () => {
    fs.copyFileSync(myIconImage, myIconImageCopy);
    fs.copyFileSync(myStartImage, myStartImageCopy);
    fs.renameSync(myIconImageCopy, iconImage);
    fs.renameSync(myStartImageCopy, StartImage);
};

exports.checkInstalled = () => {
    return fs.existsSync(executeFile);
}

exports.executeGLS = (callback) => {
    executor(executeFile, parameters, (err, data) => {
        if (err) {
            callback(false);
        }
        else {
            callback(true);
        }
    });
};