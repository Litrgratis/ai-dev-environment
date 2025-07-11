const { Auditor } = require("../../src/security/auditor");
const { describe, it, expect } = require("@jest/globals");

describe("Auditor", () => {
  it("detects unauthorized access", async () => {
    const auditor = new Auditor();
    const result = await auditor.checkAccess({ token: "invalid" });
    expect(result).toEqual({
      status: "unauthorized",
      message: "Invalid token",
    });
  });
  // Dodaj więcej testów pokrywających logowanie, alerty, edge cases
});
