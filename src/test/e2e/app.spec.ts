import { test, expect } from "@playwright/test";

test.describe("App", () => {
    test("should load the app", async ({ page }) => {
        await page.goto("/");

        await expect(page).toHaveTitle(/Nasdaq Stocks/);
    });

    test("should show splash screen initially", async ({ page }) => {
        await page.goto("/");

        // Check that splash screen elements are visible
        await expect(page.getByAltText("Nasdaq Logo")).toBeVisible();
        await expect(page.getByText("Omar Mohamed -")).toBeVisible();
        await expect(
            page.getByRole("link", { name: /@OmarMohamed11/ })
        ).toBeVisible();
    });

    test("should transition from splash to main app", async ({ page }) => {
        await page.goto("/");

        // Wait for splash screen to be visible initially
        await expect(page.getByAltText("Nasdaq Logo")).toBeVisible();

        // Wait for splash to disappear and main app to appear (2.3 seconds total)
        await expect(page.getByAltText("Nasdaq Logo")).not.toBeVisible({
            timeout: 5000,
        });

        // Check that main app content is visible
        const heading = page.getByRole("heading", { name: /Nasdaq Stocks/i });
        await expect(heading).toBeVisible();
        await expect(
            page.getByText("Explore stocks listed on the Nasdaq exchange")
        ).toBeVisible();
    });

    test("should have working GitHub link", async ({ page }) => {
        await page.goto("/");

        // Wait for splash screen
        await expect(page.getByAltText("Nasdaq Logo")).toBeVisible();

        // Click the GitHub link
        const githubLink = page.getByRole("link", { name: /@OmarMohamed11/ });
        await expect(githubLink).toBeVisible();

        // Check that the link has correct attributes
        await expect(githubLink).toHaveAttribute(
            "href",
            "https://github.com/OmarMohamed11"
        );
        await expect(githubLink).toHaveAttribute("target", "_blank");
        await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
});
