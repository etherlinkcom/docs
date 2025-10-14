// Check external links

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { glob } from 'glob';
import linkCheck from 'link-check';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsFolder = path.resolve(__dirname, '../docs');

const linkRegex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;

const regexesToIgnore = [
  /127.0.0.1/,
  /https:\/\/explorer\.etherlink\.com/,
  /https:\/\/testnet\.explorer\.etherlink\.com/,
  /https:\/\/shadownet\.explorer\.etherlink\.com/,
];

// Given a file path, load the file and get all external links in it
const getLinksInFile = async (filePath) => {
  const fileContents = await fs.promises.readFile(filePath, 'utf8');
  const externalLinksInFile = [];
  let matches;
  while ((matches = linkRegex.exec(fileContents)) !== null) {
    // Trim periods at the end of the URL because my regex-fu is insufficient
    const trimmedMatch = matches[0].endsWith('.') ? matches[0].slice(0, -1) : matches[0];
    // Check if it's in the ignore list
    const addToList = regexesToIgnore.reduce((runningResult, oneRegex) => {
      if (!runningResult || oneRegex.test(trimmedMatch)) {
        return false;
      }
      return runningResult;
    }, true);
    if (addToList) {
      externalLinksInFile.push(trimmedMatch);
    }
  }
  return externalLinksInFile;
}

// Get all external links in all files
const getAllExternalLinks = async (basePath) => {
  const allMdFilePaths = await glob(basePath + '/**/*.{md,mdx}');
  const allLinksPromises = allMdFilePaths.map(getLinksInFile);
  const allExternalLinks = await allLinksPromises.reduce(async (runningListPromise, oneListPromise) => {
    const runningListOfLinks = await runningListPromise;
    const oneList = await oneListPromise;
    oneList.forEach(oneLink => {
      if (!runningListOfLinks.includes(oneLink)) {
        runningListOfLinks.push(oneLink);
      }
    });
    return runningListOfLinks;
  }, Promise.resolve([]));
  return allExternalLinks;
}

// Check a link with https://www.npmjs.com/package/link-check
const checkLink = async (url) => new Promise((resolve, reject) => {
  linkCheck(url, (err, result) => {
    if (err) reject(err);
    if (result.status !== 'alive') reject(result.status);
    resolve(result.status);
  });
});

const runTest = async () => {
  const allLinks = await getAllExternalLinks(docsFolder);
  let foundABrokenLink = false;
  await Promise.all(allLinks.map((oneLink) =>
    checkLink(oneLink)
      // .then((status) => console.log(oneLink, '-', status))
      .catch((err) => {
        foundABrokenLink = true;
        console.error(oneLink, '-', err);
      })
  ));
  if (foundABrokenLink) {
    console.error('Found broken links.');
  } else {
    console.log('Successfully checked', allLinks.length, 'links.');
  }
}

runTest();
