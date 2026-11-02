import assert from "node:assert/strict";
import { test } from "node:test";
import { readToken, secretsMatch, signToken } from "./signed.ts";

test("a signed token round-trips", () => {
  const token = signToken({ role: "admin", exp: 10 }, "secret");
  assert.deepEqual(readToken(token, "secret"), { role: "admin", exp: 10 });
  assert.equal(readToken(token, "other"), null);
  assert.equal(readToken(`${token}x`, "secret"), null);
});

test("password comparison does not care about length", () => {
  assert.equal(secretsMatch("correct", "correct"), true);
  assert.equal(secretsMatch("no", "correct"), false);
});
