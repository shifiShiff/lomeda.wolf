/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEETS_API_KEY: string;
  readonly VITE_GOOGLE_SPREADSHEET_ID: string;
  readonly VITE_SHEET_NAME_ELEMENTARY: string;
  readonly VITE_SHEET_NAME_HIGHSCHOOL: string;
  readonly VITE_ORDER_RECIPIENT_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
