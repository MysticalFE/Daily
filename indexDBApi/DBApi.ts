import { request } from "http"
import { resolve } from "path/posix"

export type DBTable = {
  name: string
  primaryKey?: string
}

export const innerDB = window.indexedDB

export enum TransactionMode {
  READ_ONLY = 'readonly',
  READ_WRITE = 'readwrite',
  READ_WRITE_FLUSH = 'readwriteflush'
}

export enum DBOperate {
  OPEN = 'open',
  CLOSE = 'close',
  DESTORY = 'destroy',
  INSERT = 'insert',
  UPDATE_INSERT = 'updateOrInsert',
  UPDATE = 'update',
  DELETE = 'delete',
  CLEAR = 'clear',
  QUERY = 'query',
  QUERY_ALL = 'queryAll'
}

export enum DBStatusCode {
  ERROR = 'error',
  SUCCESS = 'success'
}

export class DBResult {
  readonly operate: string
  readonly status: string
  readonly message: any
  readonly data?: any

  constructor(operate: string, status: string, message: any, data?: any) {
    this.operate = operate
    this.status = status
    this.message = message
    this.data = data
  }
}

export default class IndexedDB {
  dbName: string
  tables: DBTable[]
  version?: number
  storage?: IDBDatabase

  constructor(dbName: string, tables: DBTable[], version?: number) {
    this.dbName = dbName
    this.tables = tables
    this.version = version || 1
  }

  openDB() {
    return new Promise((resolve, reject) => {
      if (!this.dbName || !this.version || !this.tables.length) {
        reject(new DBResult(DBOperate.OPEN, DBStatusCode.ERROR, 'illegal params'));
      }
      if (!innerDB) {
        reject(new DBResult(DBOperate.OPEN, DBStatusCode.ERROR, 'not surport indexDB!'))
      }
      const request = innerDB.open(this.dbName, this.version)
      request.onerror = e => {
        reject(new DBResult(DBOperate.OPEN, DBStatusCode.ERROR, e))
      }
      request.onsuccess = e => {
        resolve(new DBResult(DBOperate.OPEN, DBStatusCode.SUCCESS, 'open indexDB!'))
      }
      request.onupgradeneeded = e => {
        const db = (e.target as IDBOpenDBRequest)?.result
        this.tables.forEach((table: DBTable) => {
          if (db && !db.objectStoreNames.contains(table.name)) {
            if (table.primaryKey) {
              db.createObjectStore(table.name, { keyPath: table.primaryKey })
            } else {
              db.createObjectStore(table.name, { autoIncrement: true })
            }
          }
        })
      }
    })
  }

  closeDB() {
    this.storage?.close()
  }

  getDBInstance() {
    return this.storage
  }

  deleteDB() {
    this.closeDB();
    const resquest = innerDB?.deleteDatabase(this.dbName)
    return new Promise((resolve, reject) => {
      resquest.onerror = e => {
        reject(new DBResult(DBOperate.DESTORY, DBStatusCode.ERROR, e))
      }
      resquest.onsuccess = e => {
        resolve(new DBResult(DBOperate.DESTORY, DBStatusCode.SUCCESS, 'drop indexDB'))
      }
    })
  }
}