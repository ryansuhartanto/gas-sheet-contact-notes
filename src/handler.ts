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

    const contacts = parseContactSheet(activeSheet, e.range);

    updateContactNotes(databaseSheet, contacts, columnToWatch);
  }
}
