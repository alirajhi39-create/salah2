import assert from "node:assert/strict";
import test from "node:test";
import { acceptedPasswords, normalizePassword, verifyCredentials } from "../src/lib/auth.ts";

function withEnv(values, fn) {
  const keys = ["TEACHER_PASSWORD", "ali_rajhi", "ALI_RAJHI", "APP_PUBLIC_URL", "RENDER", "VERCEL", "AUTH_SECRET"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, values);
  try { fn(); } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

test("Arabic digits, spaces, and invisible direction marks normalize consistently", () => {
  assert.equal(normalizePassword(" \u200f١٢٣٤ "), "1234");
  assert.equal(normalizePassword("۱۲۳۴"), "1234");
});

test("a configured teacher password disables default demo access", () => {
  withEnv({ TEACHER_PASSWORD: "test-only-private-password", AUTH_SECRET: "test-only-not-a-deployment-secret" }, () => {
    assert.deepEqual(acceptedPasswords(), ["test-only-private-password"]);
    assert.equal(verifyCredentials({ password: "1234" }), null);
    assert.equal(verifyCredentials({ password: "wrong" }), null);
    const token = verifyCredentials({ password: "test-only-private-password" });
    assert.equal(typeof token, "string");
    assert.equal(verifyCredentials({ token }), token);
    assert.equal(verifyCredentials({ token: "fake" }), null);
  });
});

test("public hosting without a configured password is closed to demo login", () => {
  withEnv({ RENDER: "true" }, () => assert.deepEqual(acceptedPasswords(), []));
});

test("unconfigured local preview still supports demo login", () => {
  withEnv({}, () => assert.deepEqual(acceptedPasswords(), ["1234"]));
});
