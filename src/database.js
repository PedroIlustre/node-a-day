import fs from 'node:fs/promises'

const databasePath = new URL ('db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        
        return data
    }
    
    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist();

        return data
    }

    delete (table, id) {
        const rowIndex = this.getRowIndex(table, id)
        let resMsg = 'Nothing to delete. Check the informed Id'
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist();
            resMsg = 'The row with the id: '+ id +' has been successfuly deleted'
        }

        return resMsg
    }

    update (table, id, data) {
        const rowIndex = this.getRowIndex(table, id)
        let resMsg = 'Nothing to update. Check the informed Id'

        if (data.created_at) {
            this.#database[table][rowIndex] = { id, ...data}
            this.#persist();
            resMsg = 'The task with the id: '+ id +' has been successfuly updated'
        }
        return resMsg
    }

    searchById (table, id) {
        const data = this.#database[table] || [];
        const record = data.find(row => row.id === id);

        return record || [];
    }

    getRowIndex (table, id) {
        return this.#database[table].findIndex(row => row.id == id)
    }
}