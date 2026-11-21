import type Database from 'better-sqlite3'
import type { Migration } from './index'

export const migration030BusinessLogo: Migration = {
  version: 30,
  name: 'business_logo',
  up(db: Database.Database): void {
    const tableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'business_settings'")
      .get() as { name: string } | undefined

    if (!tableExists) return

    const existingColumns = new Set(
      (db.prepare('PRAGMA table_info(business_settings)').all() as { name: string }[]).map(
        (c) => c.name
      )
    )

    if (!existingColumns.has('logo_data')) {
      db.exec("ALTER TABLE business_settings ADD COLUMN logo_data TEXT NOT NULL DEFAULT ''")
    }
  }
}
