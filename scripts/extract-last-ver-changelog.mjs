import { resolve } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

const __dirname = import.meta.dirname;
const rootDir = resolve(__dirname, "..");

const changelogPath = resolve(rootDir, "CHANGELOG.md");
const changelog = await readFile(changelogPath, "utf-8");
const isFirstVersion = changelog.match(/\[\d+\.\d+\.\d+]/g).length === 1;

const oneVersionRegex =
  /(?<prefix>#+ \[\d+\.\d+\.\d+].+)(?<content>(.|\r|\n)*?)(?=<#\s*\[\d+\.\d+\.\d+])/;
const manyVersionsRegex =
  /(?<prefix>#+ \[\d+\.\d+\.\d+].+)(?<content>(.|\r|\n)*?)(?<suffix>#+ \[\d+\.\d+\.\d+].+)/;
const {
  groups: { content },
} = isFirstVersion
  ? oneVersionRegex.exec(changelog)
  : manyVersionsRegex.exec(changelog);

const trimmedContent = content.trim();

console.log(`Extracted last version changelog content:
-----------------------------------
${trimmedContent}
-----------------------------------
`);

const lastVerChangelogPath = resolve(rootDir, "last-ver-changelog.txt");
await writeFile(lastVerChangelogPath, trimmedContent, "utf-8");
