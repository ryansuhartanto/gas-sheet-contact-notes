# Sheet Contact Notes

A highly optimized Google Apps Script library that synchronizes contact notes between a central database and dedicated contact sheets.

Built to handle enterprise-scale Google Sheets without hitting the V8 engine's 30-second execution limit.
It utilizes in-memory Hash Maps for $O(1)$ lookups and leverages Google's backend `TextFinder` API for differential cell updates.

## Architecture Flow

- **Edit Database Sheet:** Instantly regenerates notes for the edited cells by querying a pre-compiled contact map.
- **Edit Contact Sheet:** Parses the modified contacts and executes a targeted `TextFinder` sweep across the database to update strictly the affected cells, preserving collateral data in shared cells.

## Installation & Usage

Because this is compiled as an Apps Script Library, it must be initialized and triggered from the end-user's host script.

**1. Install the Library**
Add the script ID to your Google Apps Script project and assign it the identifier (eg. `SheetContactNotes`).

**2. Configure the Host Script**
In your host `Code.gs` file, configure the library properties and wire it to the native `onEdit` trigger.

```javascript
const DatabaseSheetName = "Database";
const RequestorContactSheetName = "Requestor Contacts";
const InterpreterContactSheetName = "Interpreter Contacts";

// Initialize global configuration (optional)
SheetContactNotes.setConfig({
  includeHeader: true,
  key: "email",
  separator: "\n",
});

// Wire the event handler
function onEdit(e) {
  if (!e || !e.range) return;

  SheetContactNotes.handleOnEdit(
    e,
    DatabaseSheetName,
    RequestorContactSheetName,
    7,
  ); // Column G
  SheetContactNotes.handleOnEdit(
    e,
    DatabaseSheetName,
    InterpreterContactSheetName,
    8,
  ); // Column H
}
```

## Required Sheet Setup

You must create **at least 2 sheets** in the same spreadsheet.

| Sheet Role         | Purpose                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Database Sheet** | The primary workspace. Contains string values in the watched column (names/emails/phones). Notes are generated here. |
| **Contact Sheet**  | The source of truth. Stores the master contact records used to compile the notes.                                    |

### Contact Sheet Format (Strict)

The contact sheet **must explicitly contain exactly these first 3 columns**.

| Column | Data    |
| ------ | ------- |
| A      | `name`  |
| B      | `email` |
| C      | `phone` |

> [!IMPORTANT]
> The parser statically bounds to the first 3 columns. If these columns are missing, reordered, or empty across the entire data range, the script will throw a matrix alignment error. Multiple values in a single cell must be delimited by the configured `separator`.

## Configuration Options

Pass these options into `SheetContactNotes.setConfig()` to override the default behavior.

| Property        | Type                           | Default   | Description                                                                                             |
| --------------- | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------- |
| `includeHeader` | `boolean`                      | `false`   | Set to `true` to shift the parser math down by 1 row, preventing headers from being mapped as contacts. |
| `key`           | `"name" \| "email" \| "phone"` | `"email"` | The primary key used to link Database cells to Contact records.                                         |
| `separator`     | `string`                       | `"\n"`    | The delimiter used to split multiple emails or phones within a single cell.                             |

## Development

Install dependencies:

```bash
bun install

```

Build the TypeScript output for Apps Script (Clasp):

```bash
bun run build

```
