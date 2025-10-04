import { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

const POLYGON_API_KEY = Netlify.env.get("VITE_POLYGON_API_KEY");
const POLYGON_BASE_URL = "https://api.polygon.io";

interface ErrorResponse {
  error: string;
  status?: number;
}

const handler: Handler = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  // Validate API key exists
  if (!POLYGON_API_KEY) {
    console.error("POLYGON_API_KEY environment variable is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    // Extract the endpoint path from query parameters
    const endpoint = event.queryStringParameters?.endpoint;

    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "endpoint" query parameter' }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Build query string from all params except 'endpoint'
    const queryParams = new URLSearchParams();

    // Add all existing query parameters except 'endpoint'
    if (event.queryStringParameters) {
      Object.entries(event.queryStringParameters).forEach(([key, value]) => {
        if (key !== "endpoint" && value) {
          queryParams.append(key, value);
        }
      });
    }

    // Add the API key
    queryParams.append("apiKey", POLYGON_API_KEY);

    // Construct full URL
    const polygonUrl = `${POLYGON_BASE_URL}${endpoint}?${queryParams.toString()}`;

    console.log(`Proxying request to Polygon: ${endpoint}`);

    // Make request to Polygon API
    const response = await fetch(polygonUrl);

    // Get response body as text first
    const responseText = await response.text();

    // Try to parse as JSON, fallback to text
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    // Return the response as-is with same status code
    return {
      statusCode: response.status,
      body:
        typeof responseData === "string"
          ? responseData
          : JSON.stringify(responseData),
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Cache-Control": "public, max-age=60", // Optional: cache for 1 minute
      },
    };
  } catch (error) {
    console.error("Error proxying request to Polygon:", error);

    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 500,
    };

    return {
      statusCode: 500,
      body: JSON.stringify(errorResponse),
      headers: { "Content-Type": "application/json" },
    };
  }
};

export default handler;
