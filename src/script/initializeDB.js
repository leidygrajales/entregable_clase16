import knexConection from "../config";
(async () => {
    try {
        console.log("inicializing migrate script...")
        await knexConection.schema.dropTableIfExists('products')
        await knexConection.schema.dropTableIfExists('messages')

        await knexConection.schema.createTable("products", (table) => {
            table.increments("id").primary()
            table.string("timestamp").notNullable()
            table.string("title").notNullable()
            table.float("price").notNullable()
            table.integer("stock").notNullable()
            table.string("thumbnail").notNullable()
            table.string("description").notNullable()
        })
        await knexConection.schema.createTable("messages", (table) => {
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
        knexConection.destroy()
    }
})()