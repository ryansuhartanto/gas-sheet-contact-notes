interface Contact {
  name: string;
  emails: string[];
  phones: string[];
}

function generateContactNote(...contacts: Contact[]): string {
  return contacts
    .map((contact) => {
      const note: string[] = [];

      if (contact.name) {
        note.push(`👤 ${contact.name}`);
      }
      if (contact.emails) {
        for (const email of contact.emails) {
          note.push(`📧 ${email}`);
        }
      }
      if (contact.phones) {
        for (const phone of contact.phones) {
          note.push(`📞 ${phone}`);
        }
      }

      return note.join("\n");
    })
    .join("\n\n");
}

function generateContactMap(contacts: Contact[]): Map<string, Contact> {
  const contactMap = new Map<string, Contact>();

  switch (config.key) {
    case "name": {
      for (const contact of contacts) {
        if (!contact.name) {
          console.error("Contact is missing name as key.", {
            contact,
          });
          continue;
        }
        contactMap.set(contact.name, contact);
      }
      break;
    }
    case "email": {
      for (const contact of contacts) {
        for (const email of contact.emails) {
          contactMap.set(email, contact);
        }
      }
      break;
    }
    case "phone": {
      for (const contact of contacts) {
        for (const phone of contact.phones) {
          contactMap.set(phone, contact);
        }
      }
      break;
    }
    default: {
      throw new Error(`Unhandled contact key: ${config.key}`);
    }
  }

  return contactMap;
}
