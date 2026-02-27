import { getUninstalledInstallations } from "./get-uninstalled-installations";

describe("getUninstalledInstallations (integration)", () => {
  it("returns installations with uninstalled_at populated", async () => {
    const results = await getUninstalledInstallations();

    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.uninstalled_at).not.toBeNull();
      expect(r.owner_id).toBeGreaterThan(0);
      expect(r.owner_name).toBeTruthy();
    }
  });

  it("results are ordered by uninstalled_at ascending", async () => {
    const results = await getUninstalledInstallations();

    for (let i = 1; i < results.length; i++) {
      expect(new Date(results[i].uninstalled_at!).getTime()).toBeGreaterThanOrEqual(
        new Date(results[i - 1].uninstalled_at!).getTime(),
      );
    }
  });
});
