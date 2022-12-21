import knex from "knex"

const knexConection = knex({
    // client: "mysql",
    // connection: {
    //     host: "localhost",
    //     user: "root",
    //     port: 3306,
    //     database: "products"
    // }

    client: "sqlite3",
    connection: {
        filename: './DB/ecommerce.sqlite'
    }
})

export default knexConection