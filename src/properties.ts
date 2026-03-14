interface Properties {
  CONTACT_KEY: "name" | "email" | "phone";
  CONTACT_SHEET_INCLUDE_HEADER: string;
  CONTACT_SHEET_SEPARATOR: string;
  CONTACT_SHEET_SEPARATOR_NOTE: string;
}

declare const CONTACT_KEY: Properties["CONTACT_KEY"] | undefined;
declare const CONTACT_SHEET_INCLUDE_HEADER:
  | Properties["CONTACT_SHEET_INCLUDE_HEADER"]
  | undefined;
declare const CONTACT_SHEET_SEPARATOR:
  | Properties["CONTACT_SHEET_SEPARATOR"]
  | undefined;
declare const CONTACT_SHEET_SEPARATOR_NOTE:
  | Properties["CONTACT_SHEET_SEPARATOR_NOTE"]
  | undefined;
