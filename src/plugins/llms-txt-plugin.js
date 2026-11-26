'use strict';

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://docs.etherlink.com';

// Directories under docs/ that are not full pages.
const SKIP_DIRS = ['conrefs'];

// Rebranding markers used internally: <!--TX-->, <!--TEVM-->, <!--TXN-->,
// {/* TX */}, {/* TEVM */}, {/* TXN */}, and # tx / # tevm / # txn in titles.
const MARKER_RE = /<!--T(?:X|EVM|XN)-->|\{\/\* T(?:X|EVM|XN) \*\/\}|\s*#\s*t(?:evm|xn?)\b/gi;

function stripFrontmatter(raw) {
  const match = raw.match(/^---\n[\s\S]*?\n---\n?/);
  return match ? raw.slice(match[0].length).trim() : raw;
}

function stripContent(text) {
  return text
    .replace(MARKER_RE, '')
    .replace(/^import\s+.+from\s+['"].+['"];?\s*$/gm, '')  // JSX imports in .mdx
    .trim();
}

// Map doc ID -> {url, title, body} using the metadata Docusaurus itself
// computed, so permalinks honour `slug`, `id` and category-index conventions.
function collectDocsById(docsContent, siteDir) {
  const byId = {};
  const version = docsContent.loadedVersions[0];
  for (const doc of version.docs) {
    const rel = doc.source.replace(/^@site\//, '');
    if (SKIP_DIRS.includes(rel.split('/')[1])) continue;
    const raw = fs.readFileSync(path.join(siteDir, rel), 'utf8');
    byId[doc.id] = {
      url: doc.permalink,
      title: doc.title.replace(MARKER_RE, '').trim(),
      body: stripContent(stripFrontmatter(raw)),
    };
  }
  return byId;
}

// Walk the sidebar tree depth-first, yielding {id, section} in sidebar order.
// `section` is the label of the top-level category the page belongs to.
function extractSidebarOrder(sidebar) {
  const result = [];

  function walkItems(items, section) {
    for (const item of items) {
      if (typeof item === 'string') {
        result.push({ id: item, section });
      } else if (item.type === 'doc') {
        result.push({ id: item.id, section });
      } else if (item.type === 'category') {
        // Category link page comes first, then the category's children.
        if (item.link && item.link.type === 'doc') {
          result.push({ id: item.link.id, section });
        }
        walkItems(item.items || [], section);
      }
      // type: 'link' (external URL) — skip
    }
  }

  for (const topItem of sidebar) {
    if (topItem.type !== 'category') continue;
    // Top-level categories can also have a link page (e.g. "Tutorials").
    if (topItem.link && topItem.link.type === 'doc') {
      result.push({ id: topItem.link.id, section: topItem.label });
    }
    walkItems(topItem.items || [], topItem.label);
  }

  return result;
}

module.exports = function llmsTxtPlugin(context) {
  let byId = {};

  return {
    name: 'llms-txt-plugin',

    async allContentLoaded({ allContent }) {
      const docsContent = allContent['docusaurus-plugin-content-docs'].default;
      byId = collectDocsById(docsContent, context.siteDir);
    },

    async postBuild({ siteDir, outDir }) {
      // Load the sidebar and derive a flat, ordered list of pages.
      const sidebars = require(path.resolve(siteDir, 'sidebars.js'));
      const ordered = extractSidebarOrder(sidebars.documentationSidebar);

      // Deduplicate: a page may appear as a category `link` and again in `items`.
      const seen = new Set();
      const deduped = ordered.filter(({ id }) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      // Group pages by section, preserving the sidebar's section and page order.
      const sectionLabels = [];
      const sectionPages = {};
      for (const { id, section } of deduped) {
        const doc = byId[id];
        if (!doc) continue;  // sidebar entry with no matching file
        if (!sectionPages[section]) {
          sectionPages[section] = [];
          sectionLabels.push(section);
        }
        sectionPages[section].push(doc);
      }

      // llms.txt — index
      let index = `# Etherlink documentation\n\n`;
      index += `> Etherlink is an EVM-compatible Layer 2 on Tezos with distributed sequencing and native atomic composability between EVM and Michelson smart contracts.\n\n`;
      index += `Full content: ${SITE_URL}/llms-full.txt\n\n`;

      for (const section of sectionLabels) {
        index += `## ${section}\n\n`;
        for (const { url, title } of sectionPages[section]) {
          const label = title ?? url.split('/').filter(Boolean).pop() ?? 'index';
          index += `- [${label}](${SITE_URL}${url})\n`;
        }
        index += '\n';
      }

      fs.writeFileSync(path.join(outDir, 'llms.txt'), index);

      // llms-full.txt — all pages concatenated in sidebar order.
      // Every page body starts with a # heading; inject the URL after it.
      const allDocs = sectionLabels.flatMap(s => sectionPages[s]);
      let full = '';
      for (const { url, body } of allDocs) {
        const nl = body.indexOf('\n');
        const heading = nl === -1 ? body : body.slice(0, nl);
        const rest = nl === -1 ? '' : body.slice(nl).trimStart();
        full += `\n\n${heading}\n\nURL: ${SITE_URL}${url}\n\n${rest}\n`;
      }

      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), full.trimStart());

      console.log(`[llms-txt-plugin] Wrote llms.txt and llms-full.txt (${allDocs.length} pages).`);
    },
  };
};
