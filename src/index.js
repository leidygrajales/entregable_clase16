import express from 'express'
import { Server as HttpServer } from 'http'
import multer from 'multer'
import path from 'path'
import { Server as IOServer } from 'socket.io'
import { fileURLToPath } from 'url'
import ContainerSQL from './container/containerSQL'

import MySQLOptions from './options/optionsMySQL'
import SQLite3Options from './options/optionsSQLite3'

import router_carrito from './routes/cart.Router'
import router_productos from './routes/products.Router'

import initializeMySQL from './script/initializeMySQL'
import initializeSQLite3 from './script/initializeSQLite3'

await initializeMySQL(MySQLOptions)
await initializeSQLite3(SQLite3Options)

const upload = multer();

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080

const messagesApi = new ContainerSQL(SQLite3Options, 'messages')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(upload.array());

app.use('/api/productos', router_productos)
app.use('/api/carrito', router_carrito)
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')))
app.use(express.static(path.join(__dirname, '../public')))

app.set("views", path.join(__dirname, "../public/views"))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  res.render('pages/index')
})
app.get('/products', async (req, res) => {
  res.render('pages/products')
})
app.get('/cart', async (req, res) => {
  res.render('pages/cart')
})
app.get('*', function (req, res) {
  res.send({ status: "error", description: `ruta ${req.url} método ${req.method} no implementada` });
})

//conf de socket 
io.on('connection', async socket => {

  //historial del chat cuando el nuevo cliente se conecte 

  socket.emit('messages', await messagesApi.getAll())

  //escuchamos al cliente
  socket.on('new-message', async data => {
    messagesApi.save(data)

    //re enviamos por medio de broadcast los msn a todos los clientrs que esten conectados
    io.sockets.emit('messages', await messagesApi.getAll())
  })
})

httpServer.listen(PORT, () => console.log(`servidor corriendo en el puerto ${PORT}`))
