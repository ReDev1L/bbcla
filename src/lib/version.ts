// Application version information

export const APP_VERSION = '0.1.1';
export const APP_NAME = 'Backpack Brawl Combat Analyzer';
export const BUILD_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

export function getVersionString(): string {
  return `v${APP_VERSION}`;
}

export function getFullVersionString(): string {
  return `${APP_NAME} v${APP_VERSION}`;
}

