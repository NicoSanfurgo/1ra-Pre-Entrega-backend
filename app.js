const { productosRouter } = require('./routers/productosRouter.js')
const { cartRouter } = require('./routers/cartRouter.js')

const express = require('express')
const dotenv = require('dotenv').config()

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/api/productos', productosRouter)
app.use('/api/carrito', cartRouter)

app.use((req,res) =>{
    res.json({
        error: "-2",
        description: `ruta ${req.originalUrl} metodo ${req.method} no reconocido`
    })
})

const PORT = process.env.PORT

app.listen(PORT, (err) =>{
    if(err) throw new Error(`Error on server: ${err}`)
    console.log(`Server is listenning en el puerto: ${PORT}`);
})
