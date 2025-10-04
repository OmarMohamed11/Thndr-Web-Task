import { test, expect } from "@playwright/test";

test.describe("App", () => {
  test("should load the app", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Nasdaq Stocks/);
  });

  test("should show splash screen initially", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByAltText("Nasdaq Logo")).toBeVisible();
    await expect(page.getByText("Omar Mohamed -")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /@OmarMohamed11/ })
    ).toBeVisible();
  });

  test("should transition from splash to main app", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByAltText("Nasdaq Logo")).toBeVisible();

    await expect(page.getByAltText("Nasdaq Logo")).not.toBeVisible({
      timeout: 5000,
    });

    // Wait for either the main content or error state to appear
    await Promise.race([
      // Success case: main content loads
      page
        .waitForSelector('[data-testid="loading-spinner"]', {
          state: "hidden",
          timeout: 15000,
        })
        .then(() =>
          page.waitForSelector('[data-testid="stock-card"]', {
            timeout: 5000,
          })
        )
        .then(() => {
          // Verify main content is visible
          return Promise.all([
            expect(
              page.locator('[data-testid="stock-card"]').first()
            ).toBeVisible(),
          ]);
        }),

      // Error case: error state appears
      page
        .waitForSelector('[data-testid="error-state"]', {
          timeout: 15000,
        })
        .then(() => {
          // Verify error state is visible and has expected content
          return expect(
            page.locator('[data-testid="error-state"]')
          ).toBeVisible();
        }),
    ]);

    // Additional verification: ensure we're in a valid state (either success or error)
    const hasMainContent = await page
      .locator('[data-testid="stock-card"]')
      .first()
      .isVisible()
      .catch(() => false);
    const hasErrorState = await page
      .locator('[data-testid="error-state"]')
      .isVisible()
      .catch(() => false);

    expect(hasMainContent || hasErrorState).toBe(true);
  });

  test("should have working GitHub link", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByAltText("Nasdaq Logo")).toBeVisible();

    const githubLink = page.getByRole("link", { name: /@OmarMohamed11/ });
    await expect(githubLink).toBeVisible();

    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/OmarMohamed11"
    );
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("should handle error state gracefully", async ({ page }) => {
    // Mock API to return error
    await page.route("**/api.polygon.io/**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("/");

    // Wait for splash to disappear
    await expect(page.getByAltText("Nasdaq Logo")).not.toBeVisible({
      timeout: 5000,
    });

    // Should show error state
    await expect(page.locator('[data-testid="error-state"]')).toBeVisible({
      timeout: 15000,
    });

    // Verify error state content
    await expect(page.getByRole("heading", { name: "Error" })).toBeVisible();
    await expect(page.getByText("Try Again")).toBeVisible();
  });

  test("should show main content when API succeeds", async ({ page }) => {
    // Mock API to return successful response
    await page.route("**/api.polygon.io/**", async (route) => {
      const mockResponse = {
        status: "OK",
        results: [
          {
            ticker: "AAPL",
            name: "Apple Inc.",
            market: "stocks",
            locale: "us",
            active: true,
            primary_exchange: "XNAS",
            type: "CS",
            currency_name: "usd",
            cik: "0000320193",
            composite_figi: "BBG000B9XRY4",
            share_class_figi: "BBG001S5N8V8",
            last_updated_utc: "2023-01-01T00:00:00Z",
          },
        ],
        next_url: null,
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse),
      });
    });

    await page.goto("/");

    // Wait for splash to disappear
    await expect(page.getByAltText("Nasdaq Logo")).not.toBeVisible({
      timeout: 5000,
    });

    // Should show main content
    await expect(
      page.locator('[data-testid="stock-card"]').first()
    ).toBeVisible({
      timeout: 15000,
    });

    // Should show at least one stock card
    await expect(
      page.locator('[data-testid="stock-card"]').first()
    ).toBeVisible({
      timeout: 5000,
    });
  });
});
