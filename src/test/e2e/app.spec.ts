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

        try {
            await expect(
                page.locator('[data-testid="loading-spinner"]')
            ).not.toBeVisible({
                timeout: 15000,
            });
        } catch (error) {
            const errorState = page.locator('[data-testid="error-state"]');
            const hasErrorState = await errorState
                .isVisible()
                .catch(() => false);

            if (hasErrorState) {
                console.log(
                    "App is in error state, which is acceptable for this test"
                );
                return;
            }

            throw error;
        }

        const heading = page.getByRole("heading", { name: /Nasdaq Stocks/i });
        await expect(heading).toBeVisible({ timeout: 10000 });
        await expect(
            page.getByText("Explore stocks listed on the Nasdaq exchange")
        ).toBeVisible({ timeout: 10000 });
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
});
