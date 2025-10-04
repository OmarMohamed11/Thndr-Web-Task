const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const POLYGON_BASE_URL = "https://api.polygon.io";

export default async (req: Request) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate API key exists
  if (!POLYGON_API_KEY) {
    console.error("POLYGON_API_KEY environment variable is not set");
    return new Response(
      JSON.stringify({ error: "Server configuration error: API key not set" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse URL and get query parameters
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint");

    if (!endpoint) {
      return new Response(
        JSON.stringify({
          error: 'Missing "endpoint" query parameter',
          example:
            "/.netlify/functions/polygon-proxy?endpoint=/v3/reference/tickers",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Build query string from all params except 'endpoint'
    const queryParams = new URLSearchParams();

    url.searchParams.forEach((value, key) => {
      if (key !== "endpoint") {
        queryParams.append(key, value);
      }
    });

    // Add the API key
    queryParams.append("apiKey", POLYGON_API_KEY);

    // Construct full Polygon URL
    const polygonUrl = `${POLYGON_BASE_URL}${endpoint}?${queryParams.toString()}`;

    console.log(`Proxying request to: ${endpoint}`);

    // Make request to Polygon API
    const polygonResponse = await fetch(polygonUrl);

    // Get response body
    const responseText = await polygonResponse.text();

    // Try to parse as JSON
    let responseData;
    let contentType = "application/json";

    try {
      responseData = JSON.parse(responseText);
    } catch {
      // If not JSON, return as text
      responseData = responseText;
      contentType = polygonResponse.headers.get("Content-Type") || "text/plain";
    }

    // Return the response with same status code as Polygon
    return new Response(
      typeof responseData === "string"
        ? responseData
        : JSON.stringify(responseData),
      {
        status: polygonResponse.status,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error proxying request to Polygon:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: "Failed to proxy request to Polygon API",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
