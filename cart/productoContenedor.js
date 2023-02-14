const fs = require('fs')

class Productos{
    constructor(ruta){
        this.ruta = ruta
    }
    async save(obj){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = await JSON.parse(dataArchivo);
            if(dataArchivoParse.length){
                await fs.promises.writeFile(this.ruta, JSON.stringify( [...dataArchivoParse, {...obj, id: dataArchivoParse[dataArchivoParse.length - 1].id + 1 , timestamp: Date.now() }], null, 2))
                console.log(`El ID del producto cargado es ${dataArchivoParse[dataArchivoParse.length-1].id + 1}`);
                return `El ID del producto cargado es ${dataArchivoParse[dataArchivoParse.length-1].id + 1}`
            }else{
                await fs.promises.writeFile(this.ruta, JSON.stringify([{...obj, id: 1, timestamp: Date.now()}], null, 2))
                console.log(`El ID del producto cargado es 1`);
                return `El ID del producto cargado es 1`
            } 
        }catch(error){
            console.log(error);
        }
    }
    async updateById(obj){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = await JSON.parse(dataArchivo);
            const objIndex = dataArchivoParse.findIndex(prod => prod.id === obj.id)
            if (objIndex.length !== -1){
                dataArchivoParse[objIndex] = {...obj, timestamp: Date.now()};
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParse, null, 2));
                return {
                    msg: `Se ha actualizado el producto ${obj.id}`,
                    obj
                }
            } else{
                return {error: "No existe el producto"}
            } 
        }catch(error){
            console.log(error);
        }
    }
    async getById(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = JSON.parse(dataArchivo);
            let producto = dataArchivoParse.find(producto => producto.id === id)
            if(producto){
                return producto
            }else{
                console.log("No se encontró un producto con ese ID");
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
                console.log("No hay productos en el contenedor");
                return dataArchivoParse
            }
        }catch(error){
            console.log(error);
        }
    }
    async deleteById(id){
        console.log(id);
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
            let dataArchivoParse = JSON.parse(dataArchivo);
            let producto = dataArchivoParse.find(producto => producto.id === id)
            if(producto){
                const dataArchivoParseFiltrado = dataArchivoParse.filter(producto => producto.id !== id)
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParseFiltrado, null, 2), 'utf-8')
                console.log("Producto Eliminado");
            }else{
                console.log("No se encuentra el producto");
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

module.exports = Productos