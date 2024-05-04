const { loadJSONFilesFromFolder } = require('./../utils/json');
const fs = require('fs').promises;
const path = require('path');

const checkLanguage = (exampleJson, langJson, langName) => {

    for (const exampleCommandKey in exampleJson) {
        if (langJson[exampleCommandKey]) {
            const commandTexts = Object.keys(langJson[exampleCommandKey]);

            exampleJson[exampleCommandKey].forEach(commandText => {
                if (!commandTexts.includes(commandText)) {
                    console.log(`In file ${langName}, text for /${exampleCommandKey} with text "${commandText}" is missing.`);
                }
            });
        } else {
            console.log(`In file ${langName}, text for /${exampleCommandKey} is missing.`);
        }
    }
}


const check = async () => {
    const folderPath = path.resolve(global.mainDir, 'languages');

    const files = await loadJSONFilesFromFolder(folderPath);

    const compareJson = files['english'];

    let exampleJson = [];


    for (const key in compareJson) {
        exampleJson[key] = Object.keys(compareJson[key]);
    }


    for (const key in files) {
        if (key !== 'english') {
            checkLanguage(exampleJson, files[key], key);
        }
    }
}

check();