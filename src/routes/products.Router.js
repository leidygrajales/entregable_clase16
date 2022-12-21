const express = require('express')


const { Router } = express;
const productosRouter = new Router();


// importamos la clase Container
const Container = require('../container/container.js')

// Se instancia la clase contenedor
const ProductService = new Container("./src/productos.json")

// funcion Error
function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `Path: ${ruta}\nMethod: ${metodo}\nStatus: Unauthorized`
    } else {
        error.descripcion = 'Unauthorized'
    }
    return error
}

// Middleware para Administrador
const esAdmin = false

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.status(401).json(crearErrorNoEsAdmin(req.originalUrl, req.method))
    } else {
        next()
    }
}


// Endpoints
productosRouter.get('/', async (req, res) => {
    try {
        return res.status(200).json(await ProductService.getAll())
    } catch (error) {
        return res.status(500).json({ error: 'Error al consultar la data' })
    }

})
//    -->   /api/productos/5
productosRouter.get('/:id', async (req, res) => {
    // logica
    try {
        return res.status(200).json(await ProductService.getById(req.params.id))
    } catch (error) {
        return res.status(500).json({ error: 'Error al consultar la data' })
    }

})

// tiene permisos un admin
productosRouter.post('/', soloAdmins, async (req, res) => {
    // logica
    try {
        const result = await ProductService.save(req.body)
        return res.status(200).redirect('/')
    } catch (error) {
        return res.status(500).json({ error: 'Error al insertar el registro' })
    }

})

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    // logica

    try {
        return res.status(200).json(await ProductService.updateById(req.params.id, req.body))
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el registro' })
    }
})

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
    // logica
    try {
        return res.status(200).json(await ProductService.deleteById(req.params.id))
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el registro' })
    }

})


module.exports = productosRouter