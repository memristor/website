# Memristor's website

## Contribution
**Translations**
Translations are available in directory `/translations`. YAML format is used to describe translations.

**Configuration**
If you want to add team members, sponsors, change default language you should check `config.json`.

**Design**
All CSS/HTML/JS files are located under `/public` directory. 

**Running locally**
Make sure that you Node and npm installed. Run `npm install` to install dependencies and then `npm run build` 
every time you change something in order to generate new files. 

## Under the hood
[Netlify](https://www.netlify.com/) detects new commits and on each push it runs `npm install; npm run build`. 
Based on `/public/_index.html` new files are generated and `/public` directory is published.