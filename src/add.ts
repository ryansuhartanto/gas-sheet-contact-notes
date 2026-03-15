function addContactNotes(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  contacts: Contact[],
  column: number,
  range: GoogleAppsScript.Spreadsheet.Range = sheet.getDataRange(),
) {
  const startColumn = range.getColumn();
  const endColumn = startColumn + range.getNumColumns() - 1;

  if (column < startColumn || column > endColumn) {
    console.log("Specified column is out of range. Skipping.", {
      column,
      endColumn,
      startColumn,
    });
    return;
  }

  let row = range.getRow();
  let numRows = range.getNumRows();
  const numColumns = 1;

  const { includeHeader } = config;
  if (includeHeader && row === 1) {
    row += 1;
    numRows -= 1;
  }

  if (numRows <= 0) {
    console.log("No rows to process after accounting for header. Skipping.", {
      numRows,
      row,
    });
    return;
  }

  const processRange = sheet.getRange(row, column, numRows, numColumns);
  const processValues = processRange.getValues() as ToStringable[][];

  const contactMap = generateContactMap(contacts);

  // Values' column is only 1
  const notes: [string][] = processValues.map(([value]) => {
    const keys = splitContactKeys(value.toString());

    if (keys.length === 0) {
      console.log("Empty cell. Note will be empty.", {
        value,
      });

      return [""];
    }

    const matchedContacts = keys
      .map((key) => contactMap.get(key))
      .filter((contact) => contact !== undefined);

    if (matchedContacts.length === 0) {
      console.warn("No contact found for value. Note will be empty.", {
        value,
      });

      return [""];
    }

    return [generateContactNote(...matchedContacts)];
  });

  processRange.setNotes(notes);
  SpreadsheetApp.flush();
}
