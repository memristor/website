const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const yaml = require('yamljs');
const config = require('./config');
const request = require('request');
const similarity = require('string-similarity').findBestMatch;


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
    let mustacheContent = fs.readFileSync('public/index.mustache').toString();

    // Load languages in config
    config['languages'] = [];
    for (let language of discoverLanguages()) {
        config['languages'].push({
            'code': language,
            'code_up': language.toUpperCase(),
            'file': language === config['default_language'] ? 'index.html' : language + '.html',
        });
    }

    for (let language of discoverLanguages()) {
        config['language'] = config['languages'].find(x => x.code === language);

        let outputFilepath = path.join('./public/', config['language']['file']);
        let translationFilename = path.join('./translations/', language + '.yml');
        translation = yaml.load(translationFilename);

        let html = Mustache.to_html(mustacheContent, config);
        fs.writeFileSync(outputFilepath, html);
    }
}

function readGoogleSheet(url, callback) {
    if (url.indexOf('output=csv') < 0) {
        throw 'Please check url, File > Publish to the web... > Comma-separated values (.csv)';
    }
    request(url, (err, res, body) => {
        let rows = body.split('\r\n');
        let firstRow = true;
        let keys = [];
        let data = [];
        for (let row of rows) {
            row = row.split(',');
            if (row.find(x => x.length > 1) === undefined) break;
            if (firstRow === true) {
                firstRow = false;
                keys = row;
            } else {
                let item = {};
                keys.forEach((key, i) => item[key] = row[i]);
                data.push(item);
            }
        }
       callback(data);
    });
}

function formatMembers(members) {
    function findParam(member, key, fallback = '') {
        let bestMatch = similarity(key, Object.keys(member)).bestMatch;
        if (bestMatch.rating > 0.5) {
            let value = member[bestMatch.target];
            return (value.length > 0) ? value : fallback;
        }
        return fallback;
    }

    let formattedMembers = [];
    for (let member of members) {
        formattedMembers.push({
            email: findParam(member, 'mail'),
            name: findParam(member, 'ime') + ' ' + findParam(member, 'prezime'),
            image: findParam(member, 'slika', '/img/team/01.jpg'),
            occupation: findParam(member, 'smer'),
            linkedin: findParam(member, 'linkedin'),
            experience: findParam(member, 'iskustvo'),
        });
    }
    return formattedMembers;
}

function sortAndFilterMembers(members) {
    members.sort((a, b) => b.experience - a.experience);
    return members.filter(x => x.experience >= config['members_min_experience'])
}

function main() {
    readGoogleSheet(config['members_spreadsheet'], data => {
        let members = formatMembers(data);
        members = sortAndFilterMembers(members);
        config['members'] = members;
        renderFile();
    });
}

main();
