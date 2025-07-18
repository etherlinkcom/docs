// Check links to images in md and mdx files, in both markdown links and <img> and <Figure> tags

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { glob } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { mdxjs } from 'micromark-extension-mdxjs'
import { visit } from 'unist-util-visit';
import { expect } from 'chai';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

import { exampleAstWithBrokenLinks, expectedImagesInAst } from './resources/imageCheckTestResources.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const docsFolder = path.resolve(__dirname, '../../docs');
const imageFolder = path.resolve(__dirname, '../../static');

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

// Get file names passed in the command or if none were passed, use all files
const getFilePaths = async () => {
  if (argv.filesToCheck) {
    return argv.filesToCheck
      .split(',')
      .map((oneFilePath) =>
        path.resolve(__dirname, '../', oneFilePath)
    );
  } else {
    return glob(docsFolder + '/**/*.{md,mdx}');
  }
}
const filePaths = await getFilePaths();

const availableImagePaths = await glob(imageFolder + '/**/*.{png,jpeg,jpg,gif,svg}');

// https://unifiedjs.com/learn/guide/using-unified/
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

// Test functions to select nodes that are links to images
const mdxTestFunction = (node) => ['img', 'Figure'].includes(node.name);
const markdownTestFunction = (node) => node.type === 'image';
const htmlImageTestFunction = (node) => node.type === 'paragraph';
const htmlImageRegex = /<img.*src=\"(.+?)\".*\/>/gm;

// Get all of the images in an AST, visiting the correct nodes for MD and MDX files.
/*
For MDX, get Figure and img nodes, like this img node:
{
  "type": "mdxJsxFlowElement",
  "name": "img",
  "attributes": [
    {
      "type": "mdxJsxAttribute",
      "name": "src",
      "value": "/img/tezos_smart_contract_content.svg"
    },
    {
      "type": "mdxJsxAttribute",
      "name": "alt",
      "value": "hi"
    }
  ],
  "children": [],
  "position": {...}
},

For MD, get image nodes, like this:
{
  "type": "image",
  "title": null,
  "url": "/img/someimage.jpg",
  "alt": "some alt text",
  "position": {...}
},

For raw html images, get paragraphs that contain <img src=..., like this:
{
  type: "paragraph",
  children: [
    {
      type: "text",
      value: "<img src=\"/img/unity/unity-walletconnection-scene-qrcode-unconnected.png\" alt=\"The start of the WalletConnection scene, with no account information, showing a QR code\" style={{width: 300}} />",
      position: {...}
    }
  ]
}

*/
const getImagesInAst = (ast, /*filePath*/) => {
  const imagePathsInFile = [];
  // MDX elements
  visit(ast, mdxTestFunction, (node) => {
    const srcAttribute = node.attributes.find((attr => attr.name === 'src'));
    imagePathsInFile.push(srcAttribute.value);
  });
  // MD images
  visit(ast, markdownTestFunction, (node) => {
    imagePathsInFile.push(node.url);
  });
  // HTML images
  visit(ast, htmlImageTestFunction, (node) => {
    node.children.forEach((child) => {
      if (child.type === 'text') {
        let matches;
        while ((matches = htmlImageRegex.exec(child.value)) !== null) {
          imagePathsInFile.push(matches[1]);
        }
      }
    })
  });
  // Filter out external links to files
  return imagePathsInFile.filter((oneLink) =>
    !oneLink.startsWith('http://') && !oneLink.startsWith('https://')
  );
}

// Get a list of images used in all files
const getAllUsedImages = async () => {
  // Get all files, not files that may be limited by argv.filesToCheck
  const allMDFiles = await glob(docsFolder + '/**/*.{md,mdx}');
  const imagesUsedInDocs = await allMDFiles.reduce(async (imageListPromise, filePath) => {
    const imageList = await imageListPromise;
    const ast = await getAst(filePath);
    const imagesInAst = getImagesInAst(ast, filePath);
    imagesInAst.forEach((oneImage) => {
      if (!imageList.includes(imageFolder + oneImage)) {
        imageList.push(imageFolder + oneImage);
      }
    });
    return imageList;
  }, Promise.resolve([]));

  // Add images used in the design
  const designImages = [
    '/img/BiSortAlt2.svg',
    '/img/copy-success.svg',
    '/img/CtaVector.png',
    '/img/DisabledChevronDown.svg',
    '/img/discord.svg',
    '/img/ctaIcons/discordCtaIcon.svg',
    '/img/Etherlink-Docs-Logo.svg',
    '/img/etherlinkIcon.svg',
    '/img/external_link_white.svg',
    '/img/external_link.svg',
    '/img/FiArrowUpRight.svg',
    '/img/FiBookOpen.svg',
    '/img/FiBox.svg',
    '/img/FiChevronDown.svg',
    '/img/FiCopy.svg',
    '/img/FiHome.svg',
    '/img/FiSettings.svg',
    '/img/FiTrendingUp.svg',
    '/img/FiUsers.svg',
    '/img/FiWifi.svg',
    '/img/FiX.svg',
    '/img/favicon.svg',
    '/img/Gitlab.svg',
    '/img/github-mark-green.png',
    '/img/GreenFiChevronUp.svg',
    '/img/HiOutlineStatusOnline.svg',
    '/img/MdCode.svg',
    '/img/page-outline.svg',
    '/img/X.svg',
  ].map((shortPath) => imageFolder + shortPath);

  return imagesUsedInDocs.concat(designImages);
}
const allUsedImages = await getAllUsedImages();

it('Verify that the test gets images from ASTs', () => {
  const imagesFoundInAst = getImagesInAst(exampleAstWithBrokenLinks);
  expectedImagesInAst.forEach(oneExpectedImage => {
    expect(imagesFoundInAst,
        'Image check test failed. getImagesInAst did not find an image it should have:' + oneExpectedImage
      ).to.include(oneExpectedImage);
  });
});

describe('Test for broken image links', async () => {
  if (filePaths.length === 0) {
    console.log('No files to test.');
    return;
  }
  filePaths.forEach((filePath) => {
    it('Check image paths in ' + filePath, async () => {
      // Get the AST and the links to images in that AST
      const ast = await getAst(filePath);
      const imagesInAst = getImagesInAst(ast, filePath);
      // Find images that are missing
      imagesInAst.forEach((oneImageInAst) =>
        expect(availableImagePaths,
            'Missing image ' + oneImageInAst
          ).to.include(imageFolder + oneImageInAst)
      );
    });
  })
})

describe('Test for unused images', async () => {
  availableImagePaths.forEach((oneImage) => {
    it('Image is used: ' + oneImage, () => {
      expect(allUsedImages, 'Unused image ' + oneImage)
      .to.include(oneImage);
    });
  });
});
