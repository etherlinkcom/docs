// Check external links

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { glob } from 'glob';
import linkCheck from 'link-check';
import _ from 'lodash';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { visit } from 'unist-util-visit';

// https://unifiedjs.com/learn/guide/using-unified/
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootFolder = path.resolve(__dirname, '..');
const docsFolder = path.resolve(rootFolder, './docs');

// Ignore URLs that match these regexes
const regexesToIgnore = [
  /127.0.0.1/,
  /https:\/\/explorer\.etherlink\.com/,
  /https:\/\/testnet\.explorer\.etherlink\.com/,
  /https:\/\/shadownet\.explorer\.etherlink\.com/,
  // The following links are geo-fenced so they get a 403 from some locations
  /https:\/\/www\.gate\./,
  /https:\/\/www\.mexc\.com/,
  /https:\/\/www\.coinbase\.com/,
  /https:\/\/trustwallet\.com/,
];

// Convert file to AST, using the correct processors for MD and MDX files
const getAst = async (filePath) => {
  const fileContents = await fs.promises.readFile(filePath, 'utf8');
  if (path.extname(filePath) === '.mdx') {
    return fromMarkdown(fileContents, {
      extensions: [mdxjs()],
      mdastExtensions: [mdxFromMarkdown()]
    });
  } else if (path.extname(filePath) === '.md'){
    return processor.parse(fileContents);
  }
}

// Test function to select AST nodes that are links
const markdownTestFunction = (node) => node.type === 'link';

// Walk AST to get links
const getLinksInAst = (ast) => {
  const linksInAst = [];
  visit(ast, markdownTestFunction, (node) => {
    let addToList = true;
    // Filter local links
    if (node.url.startsWith('/') || node.url.startsWith('#')) addToList = false;
    // Filter by regexes
    addToList = addToList && regexesToIgnore.reduce((runningResult, oneRegex) => {
      if (!runningResult || oneRegex.test(node.url)) {
        return false;
      }
      return runningResult;
    }, true);
    if (addToList) linksInAst.push(node.url);
  });
  return linksInAst;
}

// Check a link with https://www.npmjs.com/package/link-check
const checkLink = async (url) => new Promise((resolve, reject) => {
  linkCheck(url, (err, result) => {
    if (err) reject(err);
    if (result.status !== 'alive') reject(result.statusCode);
    resolve(result.statusCode);
  });
});

const runTest = async () => {

  const allMdFilePaths = await glob(docsFolder + '/**/*.{md,mdx}');

  // Assemble an object with information about the links and the pages they are found on
  // Looks like this:
  /*

  const linksToCheck = [
    {
      url: "https://whatever.com",
      pages: [
        "pages/one.md",
        "pages/two.md",
      ],
    },
  ];

  Later I'll add the error as a field.
  */
  const linksToCheck = await allMdFilePaths.reduce(async (linkObjectPromise, oneFilePath) => {
    let linkObject = await linkObjectPromise;
    const oneAst = await getAst(oneFilePath);
    const linksInAst = getLinksInAst(oneAst);
    const localPath = path.relative(rootFolder, oneFilePath);

    // Update the object with the links on this page
    linksInAst.forEach((oneLink) => {
      const existingObject = _.find(linkObject, ({ url }) => url === oneLink);
      if (existingObject && !existingObject.pages.includes(localPath)) {
        // If the link is already listed, add this page
        // Remove the old element
        linkObject = _.filter(linkObject, ({url}) => url !== oneLink);
        // Update it to include this page
        existingObject.pages.push(localPath);
        // Add the element back in
        linkObject.push(existingObject);
      } else {
        // If the link is not listed, add it
        linkObject.push({
          url: oneLink,
          pages: [localPath],
        });
      }

    });
    return linkObject;
  }, Promise.resolve([]));

  // Check each link and add the result field
  const checkedLinks = await Promise.all(
    linksToCheck.map(async ({ url, pages }) => {
      const result = await checkLink(url)
        .then(() => "ok")
        .catch((errOrStatus) => errOrStatus);
      return {
        url,
        pages,
        result,
      }
    })
  );

  // Filter to broken links
  const brokenLinks = checkedLinks.filter(({ result }) => result !== "ok");

  console.log('Successfully checked', checkedLinks.length, 'links.\n');

  if (brokenLinks.length > 0) {
    console.error('Found broken links.');
    brokenLinks.forEach(({ pages, url, result }) => {
      console.error(`Broken link to ${url} returned ${result}; found on these pages:\n  ${pages.join('\n  ')}\n`);
    });
    console.error('\n\n', 'Found', brokenLinks.length, 'broken links');
    process.exit(1);
  }
}

runTest();
