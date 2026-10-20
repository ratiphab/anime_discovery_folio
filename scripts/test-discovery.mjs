import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { Script } from "node:vm";
import ts from "typescript";

// Compile the server module in memory so upstream responses can be tested offline.
const require = createRequire(import.meta.url);
function loadTs(path, globals = {}) {
  const output = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  new Script(output, { filename: path }).runInNewContext({
    exports, require: (name) => name === "server-only" ? {} : require(name),
    URLSearchParams, process: { env: { MAL_CLIENT_ID: "test-client" } }, ...globals,
  });
  return exports;
}
const requested = [];
let respond;
const { getAnime, animeQuerySchema } = loadTs("../src/lib/myanimelist.ts", {
  fetch: async (url) => {
    requested.push(new URL(url));
    return { ok: true, json: async () => respond(new URL(url)) };
  },
});
const node = (id, extra = {}) => ({ id, title: `Story ${id}`, genres: [], ...extra });
const page = (nodes, next = false) => ({
  data: nodes.map((node) => ({ node })), paging: next ? { next: "more" } : {},
});
async function discover(input, response) {
  requested.length = 0;
  respond = response;
  return getAnime(animeQuerySchema.parse(input));
}

let result = await discover({ q: "Naruto", page: 2 }, () => page([node(13)], true));
assert.equal(requested[0].searchParams.get("offset"), "12");
assert.equal(requested[0].searchParams.get("q"), "Naruto");
assert.equal(result.hasNextPage, true);
assert.equal(result.page, 2);

result = await discover({ type: "movie", status: "complete", genres: 1, page: 2 }, () => page([
  node(1, { media_type: "tv", status: "finished_airing", genres: [{ id: 1, name: "Action" }] }),
  node(2, { media_type: "movie", status: "finished_airing", genres: [{ id: 1, name: "Action" }] }),
  node(3, { media_type: "movie", status: "currently_airing", genres: [{ id: 1, name: "Action" }] }),
], true));
assert.equal(requested[0].searchParams.get("limit"), "50");
assert.equal(requested[0].searchParams.get("offset"), "50");
assert.equal(result.items.length, 1);
assert.equal(result.items[0].id, 2);
assert.equal(result.total, 1);

result = await discover({ type: "movie" }, () => page([node(1, { media_type: "tv" })], true));
assert.equal(result.items.length, 0);
assert.equal(result.hasNextPage, true, "An empty filtered batch must still allow Next");

result = await discover({ year: 2020, page: 2 }, (url) => {
  const season = url.pathname.split("/").at(-1);
  return page([node(["winter", "spring", "summer", "fall"].indexOf(season) + 1,
    { start_season: { year: 2020, season } })], season === "fall");
});
assert.equal(requested.length, 4);
assert.equal(result.items.length, 4);
assert.equal(result.hasNextPage, true);
assert.ok(requested.every((url) => url.pathname.includes("/2020/") && url.searchParams.get("offset") === "50"));

result = await discover({ year: 2020, season: "spring", q: "Story 1" }, () => page([
  node(1, { start_season: { year: 2020, season: "spring" } }),
  node(2, { start_season: { year: 2019, season: "spring" } }),
  node(3, { start_season: { year: 2020, season: "spring" } }),
]));
assert.equal(requested.length, 1);
assert.equal(result.items.length, 1);
assert.equal(result.items[0].id, 1);
assert.equal(result.hasNextPage, false);

result = await discover({ page: 100 }, () => page([node(1)], true));
assert.equal(result.hasNextPage, false, "Never offer a page beyond the API validation limit");
assert.equal(animeQuerySchema.safeParse({ page: 0 }).success, false);
await assert.rejects(discover({}, () => ({ data: "invalid" })), (error) => error.status === 502);

const { createRequestQueue } = loadTs("../src/lib/request-queue.ts");
const queue = createRequestQueue(4);
let active = 0;
let peak = 0;
const released = [];
const jobs = Array.from({ length: 50 }, (_, index) => queue(async () => {
  active++;
  peak = Math.max(peak, active);
  await new Promise((resolve) => setImmediate(resolve));
  active--;
  released.push(index);
  if (index === 2) throw new Error("Upstream failed");
  return index;
}));
const outcomes = await Promise.allSettled(jobs);
assert.equal(peak, 4);
assert.equal(released.length, 50, "Errors must release slots and all saved entries must run");
assert.equal(outcomes.filter((result) => result.status === "rejected").length, 1);
assert.equal(await queue(async () => "retry works"), "retry works");
console.log("Discovery checks passed: paging, filter batches, year/season, empty batches, validation, and library concurrency/error recovery.");
