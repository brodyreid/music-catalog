use log::log;
use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: include_str!("../migrations/0001_initial.sql"),
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:music_catalog.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_log::Builder::default().build())
        .setup(|app| {
            let handle = app.handle();
            let db_path = handle
                .path()
                .app_data_dir()
                .unwrap()
                .join("music_catalog.db");

            log::info!("Database path: {:?}", db_path);

            if let Some(parent) = db_path.parent() {
                std::fs::create_dir_all(parent).unwrap();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
