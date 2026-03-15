interface ToStringable {
  toString(): string;
}

function splitContact(cellValue: string): string[] {
  const separator = CONTACT_SHEET_SEPARATOR ?? "\n";
  return cellValue.split(separator).map((part) => part.trim());
}

function parseContactSheet(
  contactSheet: GoogleAppsScript.Spreadsheet.Sheet,
  range: GoogleAppsScript.Spreadsheet.Range = contactSheet.getDataRange(),
): Contact[] {
  const startRow = range.getRow();

  let values = range.getValues() as [
    ToStringable,
    ToStringable,
    ToStringable,
  ][];

  if (CONTACT_SHEET_INCLUDE_HEADER === "true" && startRow === 1) {
    values = values.slice(1);
  }

  return values.map(([name, emails, phones]) => ({
    emails: splitContact(emails.toString()),
    name: name.toString().trim(),
    phones: splitContact(phones.toString()),
  }));
}
