interface ToStringable {
  toString(): string;
}

function splitContactKeys(cellValue: string): string[] {
  const { separator } = config;
  return cellValue
    .split(separator)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseContactSheet(
  contactSheet: GoogleAppsScript.Spreadsheet.Sheet,
  range: GoogleAppsScript.Spreadsheet.Range = contactSheet.getDataRange(),
): Contact[] {
  const row = range.getRow();
  const column = 1;
  const numRows = range.getNumRows();
  const numColumns = 3;

  let values = contactSheet.getSheetValues(
    row,
    column,
    numRows,
    numColumns,
  ) as [ToStringable | null, ToStringable | null, ToStringable | null][];

  if (config.includeHeader && row === 1) {
    values = values.slice(1);
  }

  return values.map(([name, emails, phones]) => ({
    emails: splitContactKeys(emails?.toString() ?? ""),
    name: name?.toString().trim() ?? "",
    phones: splitContactKeys(phones?.toString() ?? ""),
  }));
}
