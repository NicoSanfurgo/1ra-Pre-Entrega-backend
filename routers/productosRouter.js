const path = require('path')
const productosPath = path.join(__dirname, '..', 'products/products.json')

const Productos = require('../cart/productoContenedor.js')
const productos = new Productos(productosPath)

const express = require('express')
const { autorizacion, autenticacion } = require('../middleware/autentication.js')
const productosRouter = express.Router()

productosRouter.use(express.json())
productosRouter.use(express.urlencoded({extended: true}))

const getProducto = async (id) => { 
    const producto = await productos.getById(id)
    return producto
}

let isAdmin = true

//Devolver los productos
productosRouter.get('/', async (req, res) => {
    try{
        res.send(await productos.getAll())
    }catch(error){
        throw new Error('Error al mostrar todos los productos')
    }
})

// Buscar un producto
productosRouter.get('/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const producto = await productos.getById(id)
        res.send(producto)
    }catch(error){
        throw new Error(`Error al mostrar el producto ${id}`)
    }
})

// Añadir un producto
productosRouter.post('/', autenticacion , autorizacion , async (req,res) =>{
    try {
        if(req.user.isAdmin){
            let producto = {}
            producto.title = req.body.title
            producto.description = req.body.description
            producto.code = req.body.code
            producto.price = req.body.price
            producto.thumbnail = req.body.thumbnail
            producto.stock = req.body.stock
            const productoGuardado = await productos.save(producto)
            res.send( productoGuardado )
            console.log(`Nuevo producto: ${ productoGuardado }`);
        }else {
			res.json({
				error: "-1",
				description: `ruta ${req.originalUrl} metodo ${req.method} no implementado`,
			});
		}
    } catch (error) {
        throw new Error("Algo salio mal al añadir el nuevo producto");
    }
})
// Actualizar un producto
productosRouter.put('/:id', autenticacion , autorizacion , async (req,res) =>{
    try {
        if(req.user.isAdmin){
            let producto = {}
            producto.id = parseInt(req.params.id)
            producto.title = req.body.title
            producto.description = req.body.description
            producto.code = req.body.code
            producto.price = req.body.price
            producto.thumbnail = req.body.thumbnail
            producto.stock = req.body.stock
            const productoActualizado = await productos.updateById(producto)
            res.send( productoActualizado )
            console.log(`Producto actualizado : ${ productoActualizado }`);
        }else {
			res.json({
				error: "-1",
				description: `ruta ${req.originalUrl} metodo ${req.method} no implementado o reconocido`,
			});
		}
    } catch (error) {
        throw new Error("Algo salio mal al actualizar el producto");
    }
})
// Eliminar un producto
productosRouter.delete('/:id', autenticacion , autorizacion , async (req,res) =>{
    try {
        if(req.user.isAdmin){
            const id = parseInt(req.params.id)
            const productoEliminado = await productos.deleteById(id)
            console.log(`Producto eliminado ID: ${ id }`);
            res.send({ 
                msg: `Se eliminó con exito el producto ID: ${id}`,
            })
        }else {
			res.json({
				error: "-1",
				description: `ruta ${req.originalUrl} metodo ${req.method} no implementado o reconocido`,
			});
		}
    } catch (error) {
        throw new Error("Algo salió mal al eliminar el producto");
    }
})

module.exports = {productosRouter, getProducto}

