const { loadJSONFilesFromFolder } = require('./../utils/json');
const fs = require('fs').promises;
const path = require('path');



const check = () => {
    const folderPath = path.resolve(global.mainDir, 'languages');

    const files = loadJSONFilesFromFolder(folderPath);


}

check();