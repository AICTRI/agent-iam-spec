#!/usr/bin/env node
// Dependency-free validation for the Agent IAM Series repository.
//
// Checks:
//   1. every *.json file parses;
//   2. every conformance vector conforms to conformance/vector.schema.json;
//   3. every external "$ref" ("./...") resolves to an existing file;
//   4. relative Markdown links under spec/, examples/, mappings/, and the root
//      READMEs resolve to existing files.
//
// Usage: node conformance/validate.mjs
// Exits non-zero when any check fails.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skipDirs = new Set([".git", "node_modules"]);
const markdownRoots = ["spec", "examples", "mappings", "profiles"];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (skipDirs.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function rel(file) {
  return relative(repoRoot, file).replaceAll("\\", "/");
}

function typeOf(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  if (Number.isInteger(value)) return "integer";
  return typeof value;
}

function matchesType(value, type) {
  const actual = typeOf(value);
  if (type === "number") return actual === "number" || actual === "integer";
  if (type === "integer") return actual === "integer";
  return actual === type;
}

// Minimal JSON Schema validator covering the subset used by vector.schema.json.
function validate(instance, schema, path, errors, schemaFile) {
  if (schema.$ref && schema.$ref.startsWith(".")) {
    const target = resolve(dirname(schemaFile), schema.$ref.split("#")[0]);
    const targetSchema = parsed.get(target);
    if (!targetSchema) {
      errors.push(`${path}: unresolved schema $ref "${schema.$ref}"`);
      return;
    }
    validate(instance, targetSchema, path, errors, target);
    return;
  }
  if (schema.type && !matchesType(instance, schema.type)) {
    errors.push(`${path}: expected ${schema.type}, got ${typeOf(instance)}`);
    return;
  }
  if (schema.enum && !schema.enum.includes(instance)) {
    errors.push(`${path}: value ${JSON.stringify(instance)} not in enum ${JSON.stringify(schema.enum)}`);
  }
  if (schema.const !== undefined && instance !== schema.const) {
    errors.push(`${path}: expected const ${JSON.stringify(schema.const)}`);
  }
  if (typeOf(instance) === "object") {
    for (const key of schema.required ?? []) {
      if (!(key in instance)) errors.push(`${path}: missing required property "${key}"`);
    }
    const props = schema.properties ?? {};
    for (const [key, value] of Object.entries(instance)) {
      if (props[key]) validate(value, props[key], `${path}.${key}`, errors, schemaFile);
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected property "${key}"`);
    }
  }
  if (typeOf(instance) === "array" && schema.items) {
    instance.forEach((item, i) => validate(item, schema.items, `${path}[${i}]`, errors, schemaFile));
  }
}

function checkRefs(node, fileDir, source, errors) {
  if (Array.isArray(node)) {
    node.forEach((n) => checkRefs(n, fileDir, source, errors));
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "$ref" && typeof value === "string" && value.startsWith("./")) {
        const target = resolve(fileDir, value.split("#")[0]);
        if (!existsSync(target)) errors.push(`${source}: unresolved $ref "${value}"`);
      } else {
        checkRefs(value, fileDir, source, errors);
      }
    }
  }
}

function checkMarkdownLinks(file, errors) {
  const dir = dirname(file);
  const text = readFileSync(file, "utf8");
  const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRe.exec(text)) !== null) {
    let target = match[1].trim().split(/\s+/)[0].replace(/^<|>$/g, "");
    target = target.split("#")[0];
    if (!target) continue;
    if (/^(https?:|mailto:|\/)/.test(target)) continue;
    const resolved = resolve(dir, target);
    if (!existsSync(resolved)) {
      errors.push(`${rel(file)}: broken link "${target}"`);
    }
  }
}

const allFiles = walk(repoRoot);
const allJson = allFiles.filter((f) => f.endsWith(".json"));
const errors = [];
const parsed = new Map();

for (const file of allJson) {
  try {
    parsed.set(file, JSON.parse(readFileSync(file, "utf8")));
  } catch (e) {
    errors.push(`${rel(file)}: invalid JSON: ${e.message}`);
  }
}

const vectorSchema = parsed.get(join(repoRoot, "conformance", "vector.schema.json"));
let vectorCount = 0;
if (vectorSchema) {
  for (const [file, doc] of parsed) {
    const r = rel(file);
    if (!r.startsWith("conformance/part-") || !r.endsWith(".json")) continue;
    vectorCount += 1;
    const local = [];
    validate(doc, vectorSchema, r, local, join(repoRoot, "conformance", "vector.schema.json"));
    errors.push(...local);
  }
}

for (const [file, doc] of parsed) checkRefs(doc, dirname(file), rel(file), errors);

const fixtureManifestPath = join(repoRoot, "schemas", "fixtures", "manifest.json");
const fixtureManifest = parsed.get(fixtureManifestPath);
let fixtureCount = 0;
if (fixtureManifest) {
  for (const fixture of fixtureManifest.fixtures ?? []) {
    const schemaPath = resolve(dirname(fixtureManifestPath), fixture.schema);
    const instancePath = resolve(dirname(fixtureManifestPath), fixture.instance);
    const schema = parsed.get(schemaPath);
    const instance = parsed.get(instancePath);
    fixtureCount += 1;
    if (!schema) errors.push(`schemas/fixtures/manifest.json: missing schema "${fixture.schema}"`);
    else if (instance === undefined) errors.push(`schemas/fixtures/manifest.json: missing instance "${fixture.instance}"`);
    else validate(instance, schema, rel(instancePath), errors, schemaPath);
  }
}

const markdownFiles = allFiles.filter(
  (f) => f.endsWith(".md") && markdownRoots.some((root) => rel(f).startsWith(`${root}/`)),
);
for (const file of markdownFiles) checkMarkdownLinks(file, errors);
for (const name of ["README.md", "README.zh-CN.md", "GOVERNANCE.md", "CONTRIBUTING.md", "CHANGELOG.md"]) {
  const file = join(repoRoot, name);
  if (existsSync(file)) checkMarkdownLinks(file, errors);
}

console.log(`JSON files parsed: ${parsed.size}/${allJson.length}`);
console.log(`Vectors validated: ${vectorCount}`);
console.log(`Schema fixtures validated: ${fixtureCount}`);
console.log(`Markdown files link-checked: ${markdownFiles.length + 5}`);

if (errors.length > 0) {
  console.error(`\nFAILED with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("All checks passed.");
