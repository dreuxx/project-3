import assert from "node:assert/strict";
import test from "node:test";
import { fetchStructures } from "../src/services/rcsb.js";
const record = (id) => ({
  rcsb_id: id,
  struct: { title: `RNA ${id}` },
  exptl: [{ method: "X-RAY DIFFRACTION" }],
  rcsb_entry_info: { resolution_combined: [1.93] },
  rcsb_accession_info: { initial_release_date: "2000-10-02T00:00:00Z" },
});

test("normalizes three live-record shapes and passes the cancellation signal", async (t) => {
  const controller = new AbortController();
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.signal, controller.signal);
    return new Response(JSON.stringify(record(url.split("/").pop())));
  });
  const data = await fetchStructures({ signal: controller.signal });
  assert.deepEqual(
    data.map((x) => x.id),
    ["1EHZ", "1TRA", "1GRZ"],
  );
  assert.equal(data[0].resolution, 1.93);
  assert.equal(data[0].released, "2000-10-02");
});
test("missing optional metadata has readable fallback values", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async (url) =>
      new Response(
        JSON.stringify({
          rcsb_id: url.split("/").pop(),
          struct: { title: "RNA" },
        }),
      ),
  );
  const [data] = await fetchStructures({});
  assert.equal(data.resolution, null);
  assert.equal(data.method, "Not reported");
});
test("the demonstration performs a real request to the missing identifier", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    urls.push(url);
    return new Response("{}", { status: 404 });
  });
  await assert.rejects(fetchStructures({ simulateError: true }), /404/);
  assert.deepEqual(urls, ["https://data.rcsb.org/rest/v1/core/entry/XXXX"]);
});
test("rate limiting reports a readable retry message", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("{}", { status: 429 }),
  );
  await assert.rejects(fetchStructures({}), /Wait a moment/);
});
test("unexpected metadata and malformed JSON are rejected", async (t) => {
  const mock = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("{}"),
  );
  await assert.rejects(fetchStructures({}), /unexpected response/);
  mock.mock.mockImplementation(async () => new Response("not json"));
  await assert.rejects(fetchStructures({}), /unreadable response/);
});
test("network cancellation is propagated to the hook", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new DOMException("Aborted", "AbortError");
  });
  await assert.rejects(fetchStructures({}), { name: "AbortError" });
});
