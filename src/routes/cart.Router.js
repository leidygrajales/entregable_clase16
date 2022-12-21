const express = require('express')

const { Router } = express;
const cartRouter = new Router();

// importamos la clase Container
const Container = require('../container/container.js')

// Se instancia la clase contenedor
const CartService = new Container("./src/carrito.json")
const ProductService = new Container("./src/productos.json")

// Endpoints
cartRouter.get('/', async (req, res) => {
    try {
        return res.status(200).json(await CartService.getAll())
    } catch (error) {
        return res.status(500).json({ error: 'Error al consultar la data' })
    }

})

cartRouter.post('/', async (req, res) => {
    try {
        const data = { productos: [] }
        const result = await CartService.save(data)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ error: 'Error al insertar el registro' })
    }
})

cartRouter.delete('/:id', async (req, res) => {
    try {
        return res.status(200).json(await CartService.deleteById(req.params.id))
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el registro' })
    }
})

cartRouter.get('/:id/products', async (req, res) => {
    try {
        const { productos } = await CartService.getById(req.params.id)
        return res.status(200).json(productos)
    } catch (error) {
        return res.status(500).json({ error: 'Error al consultar la data' })
    }
})


cartRouter.post('/:id/products', async (req, res) => {
    try {
        const carrito = await CartService.getById(req.params.id)
        const { id, title, price, thumbnail } = await ProductService.getById(req.body.id)
        const product = {
            id, title, price, thumbnail
        }
        const { productos } = carrito
        productos.push(product)

        const result = await CartService.updateById(req.params.id, carrito)
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ error: 'Error al consultar la data' })
    }
})


cartRouter.delete('/:id/products/:id_prod', async (req, res) => {
    try {
        const carrito = await CartService.getById(req.params.id)
        const { productos } = carrito
        const filteredData = productos.filter((obj) => obj.id != req.params.id_prod)
        productos.splice(0, productos.length, ...filteredData);

        const result = await CartService.updateById(req.params.id, carrito)
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el carrito' })
    }
})

module.exports = cartRouter