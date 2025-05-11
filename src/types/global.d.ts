// types/global.d.ts
export {};

declare global {
  interface Window {
    __forceLogout?: boolean;
  }
}
