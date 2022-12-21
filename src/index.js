import ContenedorSQL from './container/contenedorSql'
import config from './config'

const express = require('express')
const path = require("path")
const router_productos = require('./routes/products.router')
const router_carrito = require('./routes/cart.router')
const multer = require('multer');
const upload = multer();
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require("socket.io");

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080

const Container = require('./container/container.js')
const archivo = new Container('./src/productos.json')

const productsApi = new ContenedorSQL(config.mariaDb, 'products')
const messagesApi = new ContenedorSQL(config.sqlite3, 'mesagges')

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
const messages = []

io.on('connection', socket => {

  //historial del chat cuando el nuevo cliente se conecte 
  socket.emit('messages', messages)

  archivo.getAll().then(products => {
    socket.emit('products', products)
  })

  //escuchamos al cliente
  socket.on('new-message', data => {
    messages.push(data)

    //re enviamos por medio de broadcast los msn a todos los clientrs que esten conectados
    io.sockets.emit('messages', messages)
  })

  socket.on('new-product', data => {
    archivo.save(data).then(_ => {
      archivo.getAll().then(products => {
        //re enviamos por medio de broadcast los products a todos los clientrs que esten conectados
        io.sockets.emit('products', products)
      })
    })
  })
})

httpServer.listen(PORT, () => console.log(`servidor corriendo en el puerto ${PORT}`))
