interface ToStringable {
  toString(): string;
}

function splitContact(cellValue: string): string[] {
  const separator = CONTACT_SHEET_SEPARATOR ?? "\n";
  return cellValue.split(separator).map((part) => part.trim());
}

function parseContactSheet(
  contactSheet: GoogleAppsScript.Spreadsheet.Sheet,
  range?: GoogleAppsScript.Spreadsheet.Range,
): Contact[] {
  const values = (range ?? contactSheet.getDataRange())
    .getValues()
    .slice(CONTACT_SHEET_INCLUDE_HEADER === "true" ? 1 : 0) as [
    ToStringable,
    ToStringable,
    ToStringable,
  ][];

  return values.map(([name, emails, phones]) => ({
    emails: splitContact(emails.toString()),
    name: name.toString().trim(),
    phones: splitContact(phones.toString()),
  }));
}
