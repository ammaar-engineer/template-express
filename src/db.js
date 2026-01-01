import { createPool } from "mysql2/promise"
import { thisError } from "./error.js"


// MySQL singleton
class pool {
    mainPool
    constructor({host, user, password, database, waitForConnections, connectionLimit, queueLimit}) {
        this.mainPool = createPool({host, user, password, database, waitForConnections, connectionLimit, queueLimit})
    }

    async query(query_sql) {        
        const db = this.mainPool
        try {
            const sql = await db.query(query_sql)
            return sql
        } catch (e) {
            this.errorHandle(e)
        }
    }
    async execute(query_sql, preparedStatement) {
        const db = this.mainPool
        try {
            const sql = await db.execute(query_sql, preparedStatement)
            return sql
        } catch (e) {
            this.errorHandle(e)
        }
    }
    errorHandle(err) {        
        const errorMapping = {
            404: ['Error number not found', 500],
            1062: ["Data sudah ada (Duplicate Entry)", 409],
            1064: ["Error sql syntax ngab", 409],
            1451: ["Data gagal dihapus karena masih terkait data lain", 400],
            1452: ["User atau Referensi ID tidak ditemukan", 400],
            1406: ["Data kepanjangan le!", 400],
            1048: ["Ada kolom wajib yang kosong", 400],
        };
        const errorRowNumber = err.errno ?? 404
        const result = errorMapping[errorRowNumber]        
        thisError(result[0], result[1])        
    }
}


// MongoDB Singleton
class mongoPool {
    url
    client
    koneksi = false
    database
    
    constructor (url, database) {
        this.url = url
        this.client = new MongoClient(url)
        this.database = database
    }
    getDb = async () => {
        let databasepool
        const isConnect = this.koneksi
        if (!isConnect) {
            await this.client.connect()
            console.log(`Databases connected`)
            databasepool = this.client.db(this.database)
            this.koneksi = true            
        }
        return databasepool
        
    }
}

// MySQL
export const db = new pool()
// MongoDB
export const {getDb} = new mongoPool('mongodb://localhost:27017', 'quantamanager')