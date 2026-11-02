# IndexLovers MCP Server

[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![IndexLovers](https://img.shields.io/badge/API-IndexLovers-emerald)](https://indexlovers.com)

Official Model Context Protocol (MCP) server for [IndexLovers](https://indexlovers.com), providing real-time access to **50,000+ verified corporate insider trading transactions** filed with sovereign market regulators across four jurisdictions:

- 🇺🇸 **United States:** SEC EDGAR (Form 4 / Section 16)
- 🇪🇸 **Spain:** CNMV (MAR Art. 19 / Directivos)
- 🇸🇪 **Sweden:** Finansinspektionen (Insynsregistret)
- 🇬🇧 **United Kingdom:** FCA / London Stock Exchange RNS

---

## Features

- **Zero Authentication:** No API keys, no accounts, no signups required.
- **Dual-Currency Schema:** Delivers original native transaction values (`price`, `currency`, `totalAmount`) alongside normalized EUR amounts (`totalAmountEur`) for fair cross-border sorting.
- **Cross-Market Filtering:** Filter by market (`ALL`, `US`, `ES`, `SE`, `UK`), transaction type (`BUY`, `SELL`, `SUBSCRIPTION`), or individual ticker.
- **Sorting:** Order results chronologically (`date`) or by trade volume (`size`).

---

## Quickstart

Run directly without installation via `npx`:

```bash
npx -y indexlovers-mcp
```

Or via direct URL with the standard fetch MCP server:

```bash
npx -y @modelcontextprotocol/server-fetch https://indexlovers.com/api/v1/insiders/recent
```

---

## Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "indexlovers": {
      "command": "npx",
      "args": ["-y", "indexlovers-mcp"]
    }
  }
}
```

### Cursor

In Cursor Settings → MCP:
- **Name:** `indexlovers`
- **Type:** `command`
- **Command:** `npx -y indexlovers-mcp`

---

## Available Tools

### `get_recent_insider_filings`

Retrieves recent verified corporate insider transactions.

#### Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `market` | string | `"ALL"` | Target market: `"ALL"`, `"US"`, `"ES"`, `"SE"`, or `"UK"`. |
| `limit` | number | `10` | Maximum number of filings to return (max 100). |
| `sortBy` | string | `"date"` | Strategy: `"date"` (most recent first) or `"size"` (largest trade first). |
| `type` | string | `"ALL"` | Filter: `"ALL"`, `"BUY"`, `"SELL"`, `"SUBSCRIPTION"`. |
| `ticker` | string | `undefined` | Optional ticker filter (e.g. `"AAPL"`, `"SAN"`, `"NELLY"`). |

---

## Example Prompts

- *"Show me the 5 largest insider purchases in Spain over the last 30 days."*
- *"Are executives buying or selling stock in Swedish microcaps recently?"*
- *"What were the latest Form 4 insider transactions for US tech companies?"*

---

## License

MIT © [IndexLovers](https://indexlovers.com)
