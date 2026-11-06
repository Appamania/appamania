import { describe, expect, it } from "vitest";
import { fieldError, prepareNote } from "./note";

const valid = {
  name: "Asha Rao",
  email: "asha@example.com",
  message: "The Flutter 3.47 write-up was useful.",
  link: "https://example.com",
  website: "",
};

describe("prepareNote", () => {
  it("returns a trimmed body", () => {
    expect(prepareNote({ ...valid, name: "  Asha  " })).toEqual({
      ok: true,
      drop: false,
      body: { name: "Asha", email: valid.email, message: valid.message, link: valid.link },
    });
  });

  it("drops honeypot hits without a body", () => {
    expect(prepareNote({ ...valid, website: "https://spam.example" })).toEqual({ ok: true, drop: true });
  });

  it("rejects a bad email and a non-http link", () => {
    expect(prepareNote({ ...valid, email: "not-an-email" })).toMatchObject({ ok: false, field: "email" });
    expect(prepareNote({ ...valid, link: "ftp://files.example" })).toMatchObject({ ok: false, field: "link" });
  });

  it("checks one field on blur without blaming an earlier empty field", () => {
    expect(fieldError({ ...valid, name: "", email: "nope" }, "email")).toBe("Enter a valid email address");
  });
});
