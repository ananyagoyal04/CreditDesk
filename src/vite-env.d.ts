/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RESULTS_PASSCODE?: string;
  readonly VITE_SHEETS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
