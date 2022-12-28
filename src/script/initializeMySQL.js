import knex from 'knex'


const initializeMySQL = async (MySQLOptions) => {

  const MySQLConnection = knex(MySQLOptions)

  try {
    console.log("inicializing migrate script...")
    await MySQLConnection.schema.dropTableIfExists('products')

    await MySQLConnection.schema.createTable("products", (table) => {
      table.increments("id").primary()
      table.bigInteger("timestamp").notNullable()
      table.string("title").notNullable()
      table.float("price").notNullable()
      table.integer("stock").notNullable()
      table.string("thumbnail").notNullable()
      table.string("description").notNullable()
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    console.log("finalizing migrate script...")
    MySQLConnection.destroy()
  }
}

export default initializeMySQL