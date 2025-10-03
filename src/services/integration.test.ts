import { describe, it, expect } from "vitest";
import { getTickers, searchTickers } from "./tickerService";

describe("API Integration Tests", () => {
    it.skip("should fetch Nasdaq stocks from real API", async () => {
        const response = await getTickers({ limit: 10 });

        expect(response).toBeDefined();
        expect(response.status).toBe("OK");
        expect(response.results).toBeDefined();
        expect(Array.isArray(response.results)).toBe(true);

        if (response.results && response.results.length > 0) {
            const firstStock = response.results[0];
            expect(firstStock).toHaveProperty("ticker");
            expect(firstStock).toHaveProperty("name");
            expect(firstStock.market).toBe("stocks");
            expect(firstStock.active).toBe(true);
        }
    }, 10000);

    it.skip("should search for specific ticker", async () => {
        const response = await searchTickers("Apple", { limit: 5 });

        expect(response).toBeDefined();
        expect(response.status).toBe("OK");
        expect(response.results).toBeDefined();
    }, 10000);

    it.skip("should return next_url for pagination", async () => {
        const response = await getTickers({ limit: 100 });

        expect(response).toBeDefined();
        expect(response.next_url).toBeDefined();
        expect(typeof response.next_url).toBe("string");
    }, 10000);
});
