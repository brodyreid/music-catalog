use tauri::Manager;
use tauri_plugin_dialog;
use tauri_plugin_sql::{Migration, MigrationKind};

// ~/Library/Application Support/com.music.catalog/music_catalog.db

fn main() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: include_str!("../migrations/0001_initial.up.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 1,
            description: "undo create_initial_tables",
            sql: include_str!("../migrations/0001_intial.down.sql"),
            kind: MigrationKind::Down,
        },
        Migration {
            version: 2,
            description: "add_id_to_album_projects",
            sql: include_str!("../migrations/0002_add_id_to_album_projects.up.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "undo add_id_to_album_projects",
            sql: include_str!("../migrations/0002_add_id_to_album_projects.down.sql"),
            kind: MigrationKind::Down,
        },
        Migration {
            version: 3,
            description: "create_projects_with_all_view",
            sql: include_str!("../migrations/0003_create_projects_with_all_view.up.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "undo create_projects_with_all_view",
            sql: include_str!("../migrations/0003_create_projects_with_all_view.down.sql"),
            kind: MigrationKind::Down,
        },
        Migration {
            version: 4,
            description: "create_projects_search_virtual_table",
            sql: include_str!("../migrations/0004_create_projects_search_virtual_table.up.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "undo create_projects_search_virtual_table",
            sql: include_str!("../migrations/0004_create_projects_search_virtual_table.down.sql"),
            kind: MigrationKind::Down,
        },
        Migration {
            version: 5,
            description: "rename_folder_path_hash_column",
            sql: include_str!("../migrations/0005_rename_folder_path_hash_column.up.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "undo rename_folder_path_hash_column",
            sql: include_str!("../migrations/0005_rename_folder_path_hash_column.down.sql"),
            kind: MigrationKind::Down,
        },
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:music_catalog.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
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
