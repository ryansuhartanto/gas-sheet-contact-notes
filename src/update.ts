function updateContactNotes(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  contacts: Contact[],
  column: number,
  range?: GoogleAppsScript.Spreadsheet.Range,
) {
  const { includeHeader } = config;

  const row = 1 + (includeHeader ? 1 : 0);
  const lastRow = sheet.getLastRow();

  if (lastRow <= row) {
    console.log("No rows found. Notes will not be updated.", {
      lastRow,
      row,
    });
    return;
  }

  let editedContacts = contacts;

  if (range) {
    let start = range.getRow() - 1;
    let end = range.getNumRows();

    if (includeHeader) {
      if (start === 0) {
        start += 1;
        end -= 1;
      }

      start -= 1;
    }

    editedContacts = contacts.slice(start, start + end);
  }

  if (editedContacts.length === 0) {
    console.log("No edited contacts found. Notes will not be updated.", {
      range,
    });
    return;
  }

  const numRows = lastRow - row + 1;
  const numColumns = 1;

  const processRange = sheet.getRange(row, column, numRows, numColumns);
  const processRows = new Set<number>();

  let searchKeys: string[] = [];
  switch (config.key) {
    case "name": {
      searchKeys = editedContacts.map((c) => c.name);
      break;
    }
    case "email": {
      searchKeys = editedContacts.flatMap((c) => c.emails);
      break;
    }
    case "phone": {
      searchKeys = editedContacts.flatMap((c) => c.phones);
      break;
    }
    default: {
      throw new Error(`Unhandled contact key: ${config.key}`);
    }
  }

  for (const key of searchKeys) {
    if (!key) {
      console.log("Empty key found. Skipping.");
      continue;
    }

    const matches = processRange
      .createTextFinder(key)
      .matchEntireCell(false)
      .findAll();
    for (const match of matches) {
      processRows.add(match.getRow());
    }
  }

  if (processRows.size === 0) {
    console.log("No matching cells found. Notes will not be updated.");
    return;
  }

  const contactMap = generateContactMap(contacts);

  for (const processRow of processRows) {
    const cell = sheet.getRange(processRow, column);
    const value = cell.getValue() as ToStringable;
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

      cell.clearNote();
      continue;
    }

    cell.setNote(generateContactNote(...matchedContacts));
    SpreadsheetApp.flush();
  }
}
