import Database from '@tauri-apps/plugin-sql';

let dbInstance: Database | null = null;

export const getDatabase = async (): Promise<Database> => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await Database.load('sqlite:music_catalog.db');
  return dbInstance;
};
