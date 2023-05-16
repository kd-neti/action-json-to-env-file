"use strict";
const core = require('@actions/core')
const fs = require("fs");
const path = require("path");
const fg = require('fast-glob');


// let filePath = path.parse(process.argv[2]);
// let filePattern = process.argv[2];
const filePattern = core.getInput("filePattern", { required: true })

async function findConf(filePattern){
  console.log("Converting json files pattern:", filePattern)

  const entries = await fg([filePattern], { dot: true });

  if(entries.length == 0){
    console.log(' -', 'File not found')
  }

  for (let i=0;i<entries.length;i++){
    let filePath = path.parse(entries[i]);
    let rawdata = fs.readFileSync(filePath.dir + '/' + filePath.base);
    let config = JSON.parse(rawdata);
    let output = "";
    for (let key of Object.keys(config)) {
      output += `${key.toUpperCase()}=${config[key]}\n`;
    }
    let outFile = filePath.dir + '/' + filePath.name + ".env"
    fs.writeFileSync(outFile, output);

    console.log(' -', entries[i], '>>>', outFile)

  }
}

findConf(filePattern)