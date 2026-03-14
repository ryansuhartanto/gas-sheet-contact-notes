function updateContactNotes(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  contacts: Contact[],
  column: number,
) {
  const includeHeader = CONTACT_SHEET_INCLUDE_HEADER === "true";

  const row = 1 + (includeHeader ? 1 : 0);
  const lastRow = sheet.getLastRow();

  if (lastRow <= row) {
    console.log("No rows found. Notes will not be updated.", {
      lastRow,
      row,
    });
    return;
  }

  const numRows = lastRow - row + 1;
  const numColumns = 1;

  const processRange = sheet.getRange(row, column, numRows, numColumns);
  const processRows = new Set<number>();

  let searchKeys: string[] = [];
  switch (CONTACT_KEY ?? "email") {
    case "name": {
      searchKeys = contacts.map((c) => c.name);
      break;
    }
    case "email": {
      searchKeys = contacts.flatMap((c) => c.emails);
      break;
    }
    case "phone": {
      searchKeys = contacts.flatMap((c) => c.phones);
      break;
    }
    default: {
      throw new Error(`Unhandled contact key: ${CONTACT_KEY}`);
    }
  }

  for (const key of searchKeys) {
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
    const emails = splitContact(value.toString());

    const matchedContacts = emails
      .map((email) => contactMap.get(email))
      .filter((contact) => contact !== undefined);

    if (matchedContacts.length === 0) {
      console.warn("No contact found for value. Note will be empty.", {
        value,
      });

      cell.setNote("");
      continue;
    }

    cell.setNote(generateContactNote(...matchedContacts));
  }
}
