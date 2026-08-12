import * as SQLite from "expo-sqlite";

import {
  DATABASE_NAME,
  HISTORY_RETENTION_DAYS,
  HISTORY_TABLE,
} from "@/constants/storage";
import {
  HistoryRecord,
  PatientGroup,
  PatientSummary,
} from "@/types/dengue";
import * as Crypto from "expo-crypto";
import { decryptField, encryptField } from "./crypto";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
export function groupHistoryRecordsByPatient(
  records: HistoryRecord[],
): PatientGroup[] {
  const groups = new Map<string, HistoryRecord[]>();

  for (const record of records) {
    const key = record.mrn.trim();
    const existing = groups.get(key);
    if (existing) {
      existing.push(record);
    } else {
      groups.set(key, [record]);
    }
  }

  return Array.from(groups.values())
    .map((groupRecords) => {
      const sorted = [...groupRecords].sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      return { mrn: sorted[0].mrn, name: sorted[0].name, records: sorted };
    })
    .sort((a, b) => b.records[0].createdAt - a.records[0].createdAt);
}

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
      await db.execAsync(`
                CREATE TABLE IF NOT EXISTS ${HISTORY_TABLE} (
                id TEXT PRIMARY KEY NOT NULL,
                createdAt INTEGER NOT NULL,
                nameCipher TEXT NOT NULL,
                mrnCipher TEXT NOT NULL,
                gender TEXT NOT NULL,
                weight REAL NOT NULL,
                height REAL NOT NULL,
                bmi REAL NOT NULL,
                ibw REAL NOT NULL,
                abw REAL NOT NULL,
                classification TEXT NOT NULL,
                basis TEXT NOT NULL,
                weightKg REAL NOT NULL,
                shockStatus TEXT NOT NULL,
                fluidRateId TEXT NOT NULL,
                fluidRateLabel TEXT NOT NULL,
                fluidRateMode TEXT NOT NULL,
                fluidResult REAL NOT NULL
                );
                `);
      return db;
    });
  }
  return dbPromise;
}

type SaveInput = Omit<HistoryRecord, "id" | "createdAt">;

async function rowToRecord(row: any): Promise<HistoryRecord> {
  return {
    id: row.id,
    createdAt: row.createdAt,
    name: await decryptField(row.nameCipher),
    mrn: await decryptField(row.mrnCipher),
    gender: row.gender,
    weight: row.weight,
    height: row.height,
    bmi: row.bmi,
    ibw: row.ibw,
    abw: row.abw,
    classification: row.classification,
    basis: row.basis,
    weightKg: row.weightKg,
    shockStatus: row.shockStatus,
    fluidRateId: row.fluidRateId,
    fluidRateLabel: row.fluidRateLabel,
    fluidRateMode: row.fluidRateMode,
    fluidResult: row.fluidResult,
  };
}

export async function saveHistoryRecord(record: SaveInput): Promise<String> {
  const db = await getDb();
  const id = Crypto.randomUUID();
  const createdAt = Date.now();
  const nameCipher = await encryptField(record.name);
  const mrnCipher = await encryptField(record.mrn);

  await db.runAsync(
    `INSERT INTO ${HISTORY_TABLE}
            (id, createdAt, nameCipher, mrnCipher, gender, weight, height, bmi, ibw, abw, classification, basis,
            weightkg, shockStatus, fluidRateId, fluidRateLabel, fluidRateMode, fluidResult)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
    [
      id,
      createdAt,
      nameCipher,
      mrnCipher,
      record.gender,
      record.weight,
      record.height,
      record.bmi,
      record.ibw,
      record.abw,
      record.classification,
      record.basis,
      record.weightKg,
      record.shockStatus,
      record.fluidRateId,
      record.fluidRateLabel,
      record.fluidRateMode,
      record.fluidResult,
    ],
  );

  return id;
}

export async function getAllHistoryRecords(): Promise<HistoryRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM ${HISTORY_TABLE} ORDER BY createdAt DESC`,
  );
  return Promise.all(rows.map(rowToRecord));
}

export async function getHistoryRecordById(
  id: string,
): Promise<HistoryRecord | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    `SELECT * FROM ${HISTORY_TABLE} WHERE id = ?`,
    [id],
  );
  return row ? rowToRecord(row) : null;
}

export async function deleteHistoryRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM ${HISTORY_TABLE} WHERE id=?`, [id]);
}

export async function purgeExpiredHistoryRecords(): Promise<void> {
  const db = await getDb();
  const cutoff = Date.now() - HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  await db.runAsync(`DELETE FROM ${HISTORY_TABLE} WHERE createdAt <? `, [
    cutoff,
  ]);
}

export async function hasHistoryRecords(): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${HISTORY_TABLE}`,
  );
  return (row?.count ?? 0) > 0;
}

export async function getPatientList(): Promise<PatientSummary[]> {
  const records = await getAllHistoryRecords();
  return groupHistoryRecordsByPatient(records).map((group) => {
    const latest = group.records[0]; // newest first, per groupHistoryRecordsByPatient
    return {
      name: group.name,
      mrn: group.mrn,
      gender: latest.gender,
      weight: latest.weight,
      height: latest.height,
    };
  });
}
