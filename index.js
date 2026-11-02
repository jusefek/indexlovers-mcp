#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = "https://indexlovers.com/api/v1/insiders/recent";

const server = new Server(
  {
    name: "indexlovers-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_recent_insider_filings",
      description:
        "Get recent verified corporate insider transactions (PDMR / Form 4 / MAR Art. 19) across US (SEC), Spain (CNMV), Sweden (FI), and UK (FCA). Includes dual-currency representation (official local currency and normalized EUR).",
      inputSchema: {
        type: "object",
        properties: {
          market: {
            type: "string",
            description: "Market filter: 'ALL', 'US', 'ES', 'SE', 'UK'",
            enum: ["ALL", "US", "ES", "SE", "UK"],
            default: "ALL",
          },
          limit: {
            type: "number",
            description: "Max number of filings to return (default 10, max 100)",
            default: 10,
          },
          sortBy: {
            type: "string",
            description: "Sorting strategy: 'date' (most recent first) or 'size' (largest trade first by totalAmountEur)",
            enum: ["date", "size"],
            default: "date",
          },
          type: {
            type: "string",
            description: "Filter by transaction type: 'ALL', 'BUY', 'SELL', 'SUBSCRIPTION'",
            enum: ["ALL", "BUY", "SELL", "SUBSCRIPTION"],
            default: "ALL",
          },
          ticker: {
            type: "string",
            description: "Optional ticker symbol filter (e.g., 'AAPL', 'SAN', 'NELLY', 'AZN')",
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  if (name !== "get_recent_insider_filings") {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const market = (args.market || "ALL").toString().toUpperCase();
    const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 100);
    const sortBy = args.sortBy === "size" ? "size" : "date";
    const type = (args.type || "ALL").toString().toUpperCase();

    const url = new URL(BASE_URL);
    url.searchParams.set("market", market);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("sortBy", sortBy);
    if (type !== "ALL") {
      url.searchParams.set("type", type);
    }
    if (args.ticker) {
      url.searchParams.set("ticker", String(args.ticker).trim().toUpperCase());
    }

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "indexlovers-mcp/1.0.0 (+https://indexlovers.com/developers)",
      },
    });

    if (!res.ok) {
      return {
        content: [
          {
            type: "text",
            text: `IndexLovers API returned HTTP ${res.status}: ${res.statusText}`,
          },
        ],
        isError: true,
      };
    }

    const data = await res.json();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [
        {
          type: "text",
          text: `Error querying IndexLovers API: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("IndexLovers MCP server running on stdio transport.");
}

main().catch((err) => {
  console.error("Fatal MCP error:", err);
  process.exit(1);
});
