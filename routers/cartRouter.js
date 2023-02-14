const path = require('path')

const cartPath = path.join(__dirname, '..', 'products/carts.json')
const Cart = require('../cart/cartContenedor')
const carts = new Cart(cartPath)

const productosPath = path.join(__dirname, '..', 'products/products.json')
const Productos = require('../cart/productoContenedor.js')
const productos = new Productos(productosPath)

const { getProducto } = require('./productosRouter')

const express = require('express')
const cartRouter = express.Router()
cartRouter.use(express.json())
cartRouter.use(express.urlencoded({extended: true}))

// Obtener carritos
cartRouter.get('/', async (req, res) => {
	try {
		res.send(await carts.getAll());
	}
	catch (error) {
		throw new Error("Hubo un error al mostrar los carritos");
	}
});

// Obtiene los productos de el carrito
cartRouter.get('/:id/productos', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		console.log(`Carrito buscado: ${id}`);
		const carrito = await carts.getById(id);
		const productosCarrito = carrito.productos 
		if(carrito){
			res.send(productosCarrito)
		}else{
			console.log("No existe");
		}
	}
	catch (error) {
		throw new Error("Error al mostrar los productos del carrito seleccionado");
	};
});

//Crear carritos con o sin producto
cartRouter.post('/', async (req, res) => {
	try {
		const idProducto = parseInt(req.body.idProducto)

		const crearCarritoConProducto =  async (idProducto) =>{
			const producto = await productos.getById(idProducto)
			const carrito = await carts.crearCarrito(producto);
			const respuesta = res.send({
				msg: `Se añadio el producto ${producto.id} en el carrito ${carrito.id}`,
				carrito
			})
			return respuesta
		}

		const crearCarritoSinProducto = async () =>{
			const carrito = await carts.crearCarrito();
			const respuesta = res.send({
				msg: `Se cargó el carrito ID: ${carrito.id}`,
				carrito
			})
			return respuesta
		}

		idProducto ? crearCarritoConProducto(idProducto) : crearCarritoSinProducto()

	}
	catch (error) {
		throw new Error(`Error al agregar el producto`);
	};
});

// Enviar productos al carrito
cartRouter.post('/:id/productos', async (req, res) => {
	try {
		const idProducto = parseInt(req.body.idProducto)
		const producto = await productos.getById(idProducto)
		const idCarrito = parseInt(req.params.id)
		const carrito = await carts.getById(idCarrito);
		const carritoActualizado = await carts.updateCart(producto, idCarrito)
		res.send({
			msg: `Se añadio el producto ${producto.id} en el carrito ${carrito.id}`,
			carritoActualizado
		})
	}
	catch (error) {
		throw new Error(`Error al agregar el producto al carrito`);
	};
});

//Eliminar carrito
cartRouter.delete('/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const obj = await carts.deleteById(id);
		res.send(obj);
	}
	catch (error) {
		throw new Error(`Error al eliminar el carrito`);
	}
});

//Eliminar productos del carrito
cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
	try {
		const idProducto = parseInt(req.params.id_prod)
		const idCarrito = parseInt(req.params.id)
		const producto = await productos.getById(idProducto)
		const carrito = await carts.getById(idCarrito);
		
		const productoEliminado = await carts.deleteProductById(idProducto, idCarrito)
		res.send({
			msg: `Se eliminó el producto ${producto.id} en el carrito ${carrito.id}`,
			productoEliminado
		}) 
	}
	catch (error) {
		throw new Error(`Error al borrar el producto`);
	}
});

module.exports = { cartRouter };