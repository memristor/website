const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const yaml = require('yamljs');
const config = require('./config');


let translation = null;
config.year = (new Date()).getFullYear();
config.t = () => {
    return (val) => {
        return translation[val] !== undefined ? translation[val] : val;
    };
};

function discoverLanguages() {
    let lanuageFiles = fs.readdirSync('./translations/');
    return lanuageFiles.map(x => x.split('.')[0])
}

function renderFile() {
    let mustacheContent = fs.readFileSync('public/_index.html').toString();

    for (let languageCode of discoverLanguages()) {
        config.languageCode = languageCode;
        let outputFilename = languageCode === config.defaultLanguage ? 'index' : languageCode;
        let outputFilepath = path.join('./public/', outputFilename + '.html');
        let translationFilename = path.join('./translations/', languageCode + '.yml');
        translation = yaml.load(translationFilename);

        let html = Mustache.to_html(mustacheContent, config);
        fs.writeFileSync(outputFilepath, html);
    }
}


function main() {
    renderFile();
}

main();
