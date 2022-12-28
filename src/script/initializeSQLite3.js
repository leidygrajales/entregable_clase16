import knex from 'knex'

const initializeSQLite3 = async (SQLite3Options) => {

  const SQLite3Connection = knex(SQLite3Options)
  try {
    console.log("inicializing migrate script...")
    await SQLite3Connection.schema.dropTableIfExists('messages')

    await SQLite3Connection.schema.createTable("messages", (table) => {
      table.increments("id").primary()
      table.string("user").notNullable()
      table.string("message").notNullable()
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    console.log("finalizing migrate script...")
    SQLite3Connection.destroy()
  }
}

export default initializeSQLite3