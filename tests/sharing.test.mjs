import assert from "node:assert/strict";
import test from "node:test";
import { resolveStudentShareTarget } from "../src/lib/sharing.ts";

test("restricted preview and local URLs never produce share links", () => {
  for (const origin of [
    "https://3000-sandbox.e2b.app",
    "https://arena.ai",
    "https://code.arena.ai",
    "https://lmarena.ai",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://private.internal",
    "https://example.com",
  ]) {
    const target = resolveStudentShareTarget("", origin);
    assert.equal(target.status, "preview", origin);
    assert.equal(target.url, null, origin);
  }
});

test("a deployed app shares only its student route", () => {
  assert.deepEqual(resolveStudentShareTarget("", "https://my-worksheet.onrender.com"), {
    status: "public",
    url: "https://my-worksheet.onrender.com/student",
  });
  assert.equal(resolveStudentShareTarget("https://school.edu.sa/teacher?token=private#part").url, "https://school.edu.sa/student");
});

test("explicit public deployment overrides preview origin", () => {
  assert.equal(resolveStudentShareTarget("https://my-worksheet.onrender.com/", "https://3000-sandbox.e2b.app").url, "https://my-worksheet.onrender.com/student");
});

test("invalid configured URLs do not fall back to a preview or another site", () => {
  for (const configured of ["not a url", "javascript:alert(1)", "http://school.edu.sa", "https://user:password@school.edu.sa", "https://school.edu.sa:8443"]) {
    const target = resolveStudentShareTarget(configured, "https://my-worksheet.onrender.com");
    assert.equal(target.url, null, configured);
  }
  assert.equal(resolveStudentShareTarget("https://arena.ai", "https://my-worksheet.onrender.com").url, null);
});

test("no origin is pending, never a made-up public URL", () => {
  assert.deepEqual(resolveStudentShareTarget(), { status: "pending", url: null });
});
