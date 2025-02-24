import Database from '@tauri-apps/plugin-sql';

const db: Database = await Database.load('sqlite:music_catalog.db');

export default db;
