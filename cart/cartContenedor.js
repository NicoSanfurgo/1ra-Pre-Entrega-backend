const fs = require('fs')

class Cart{
    constructor(ruta){
        this.ruta = ruta
    }
    async crearCarrito(obj){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = await JSON.parse(dataArchivo);
            if(dataArchivoParse.length){
                const carrito = {productos: [{obj}], id: dataArchivoParse[dataArchivoParse.length - 1].id + 1 , timestamp: Date.now() }
                await fs.promises.writeFile(this.ruta, JSON.stringify( [...dataArchivoParse, carrito], null, 2))
                return carrito
            }else{
                await fs.promises.writeFile(this.ruta, JSON.stringify([{ productos: [{obj}], id: 1 , timestamp: Date.now()}], null, 2))
                console.log(`El ID del carrito cargado es 1`);
                return `El ID del carrito cargado es 1`
            } 
        }catch(error){
            console.log(error);
        }
    }
    async updateCart(producto, idCarrito){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = await JSON.parse(dataArchivo);

            const objIndex = dataArchivoParse.findIndex(cart => cart.id === idCarrito)
            if (objIndex.length !== -1){
                const carrito = {productos: [...dataArchivoParse[objIndex].productos, producto] , timestamp: Date.now(), id: idCarrito}
                dataArchivoParse[objIndex] = carrito;
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParse, null, 2));
                return carrito
            } else{
                return {error: "No existe el carrito"}
            } 
        }catch(error){
            console.log(error);
        }
    }
    async getById(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = JSON.parse(dataArchivo);
            let cart = dataArchivoParse.find(cart => cart.id === id)
            if(cart){
                return cart
            }else{
                console.log("No se encontró un carrito con ese ID");
                return null
            }
        }catch(error){
            console.log(error);
        }
    }
    async getAll(){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = JSON.parse(dataArchivo);
            if(dataArchivoParse.length){
                return dataArchivoParse
            }else{
                console.log("No hay carrito en el contenedor");
                return dataArchivoParse
            }
        }catch(error){
            console.log(error);
        }
    }
    async deleteById(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = JSON.parse(dataArchivo);
            let cart = dataArchivoParse.find(cart => cart.id === id)
            if(cart){
                const dataArchivoParseFiltrado = dataArchivoParse.filter(cart => cart.id !== id)
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParseFiltrado, null, 2), 'utf-8')
                console.log("Carrito Eliminado");
            }else{
                console.log("No se encuentra el carrito");
            }
        }catch(error){
            console.log(error);
        }
    }
    async deleteProductById(idProducto, idCarrito){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = JSON.parse(dataArchivo);
            let cart = dataArchivoParse.find(cart => cart.id === idCarrito)
            let prod = cart.productos.filter(prod => prod.id !== idProducto)
            if(cart){
                const dataArchivoParseFiltrado = prod
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParseFiltrado, null, 2), 'utf-8')
                return dataArchivoParseFiltrado
            }else{
                console.log("No se encuentra el carrito");
            }
        }catch(error){
            console.log(error);
        }
    }
    async deleteAll(){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = JSON.parse(dataArchivo);
            if(dataArchivoParse.length){
                await fs.promises.writeFile(this.ruta, JSON.stringify([]), null, 2 , 'utf-8')
                console.log("Productos eliminados");
            }else{
                console.log("No hay productos para eliminar");
            }
        }catch(error){
            console.log(error);
        }
    }
}

module.exports = Cart