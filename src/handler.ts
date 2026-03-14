function handleOnEdit(
  e: GoogleAppsScript.Events.SheetsOnEdit,
  databaseSheetName: string,
  contactSheetName: string,
  columnToWatch: number,
) {
  const activeSheet = e.source.getActiveSheet();
  const activeSheetName = activeSheet.getName();

  if (activeSheetName === databaseSheetName) {
    const contactSheet = e.source.getSheetByName(contactSheetName);
    if (!contactSheet) {
      throw new Error(`Sheet with name "${contactSheetName}" not found.`);
    }

    const contacts = parseContactSheet(contactSheet);

    addContactNotes(activeSheet, contacts, columnToWatch, e.range);
  } else if (activeSheetName === contactSheetName) {
    const databaseSheet = e.source.getSheetByName(databaseSheetName);
    if (!databaseSheet) {
      throw new Error(`Sheet with name "${databaseSheetName}" not found.`);
    }

    const row = e.range.getRow();
    const numRows = e.range.getNumRows();

    const column = 1;
    const numColumns = 3;

    const range = activeSheet.getRange(row, column, numRows, numColumns);

    const contacts = parseContactSheet(activeSheet, range);

    updateContactNotes(databaseSheet, contacts, columnToWatch);
  }
}
