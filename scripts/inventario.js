/**
 * Tipo Movimiento
 * 1    =   Entrada
 * 2    =   Salida
*/
/**
 * Tipo Transaccion
 * 1    =   Venta                   (-)
 * 2    =   Devolución S/Compra     (-)
 * 3    =   Ajuste (-)              (-)
 * 4    =   Compra                  (+)
 * 5    =   Devolución S/Venta      (+)
 * 6    =   Ajuste (+)              (+)
*/

let transaccionesSalida = [1, 2, 3]
let transaccionesEntrada = [4, 5, 6]

/**
 * Arreglos para almacenar datos en localStorage
*/
var proveedores = [];
var clientes = [];
var articulosMovimiento = [];
var movimientosInventario = [];

contieneInformacion = (x) => {
    if (x === "" || x === undefined) return false;
    else return true;
}

/**
 * Clase para almacenar los movimientos de inventario.
*/
class movimientoInventario {
    constructor(idMovimiento, idAutorMov, idTransaccion, detalle) {
        this.idMovimiento = idMovimiento;
        this.idAutorMov = idAutorMov;
        this.idTipoMovimiento = transaccionesEntrada.includes(parseInt(idTransaccion)) ? 1 : 2;
        this.idTransaccion = idTransaccion;
        this.detalle = detalle;
    }
}

/**
 * Clase para almacenar los proveedores.
*/
class proveedor {
    constructor(idProveedor, datosGenerales) {
        this.idProveedor = idProveedor;
        this.datosGenerales = datosGenerales;
    }
}

/**
 * Clase para almacenar los clientes.
*/
class cliente {
    constructor(idCliente, datosGenerales) {
        this.idCliente = idCliente;
        this.datosGenerales = datosGenerales;
    }
}

/**
 * Clase para guardar datos generales aplicables a clientes/proveedores.
*/
class persona {
    constructor(identificador, nombre, direccion, telefono, email) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }
}

/**
 * Clase para almacenar detalle de productos.
*/
class detalle {
    constructor(codigo, cantidad, precio, total) {
        this.codigo = codigo;
        this.cantidad = cantidad;
        this.precio = precio;
        this.total = total;
    }
}

/**
 * Metodo para agregar proveedores/clientes.
*/
agregarPersona = () => {
    //declaramos las variables con los datos ingresados por el usuario
    let tipo = document.getElementById("pTipo").value;
    let identificacion = document.getElementById("pIdentificacion").value;
    let nombre = document.getElementById("pNombre").value;
    let direccion = document.getElementById("pDireccion").value;
    let telefono = document.getElementById("pTelefono").value;
    let email = document.getElementById("pEmail").value;

    //declaramos variable con los datos generales, de tipo persona
    let datosGenerales = new persona(identificacion, nombre, direccion, telefono, email);
    let correlativoSiguiente = 1;
    //si el tipo es 1, agregamos un nuevo proveedor al arreglo de proveedores
    if (tipo == 1) {
        //llenamos el arreglo con los valores previos cargados en localstorage
        proveedores = localStorage.getItem("proveedores") === null ? [] : JSON.parse(localStorage.getItem('proveedores'));
        //obtenemos el correlativo siguiente (idproveedor) en caso ya haya proveedores ingresados
        if (proveedores.length > 0) correlativoSiguiente = parseInt(proveedores[proveedores.length - 1].idProveedor) + 1;
        //agregamos el proveedor al arreglo
        proveedores.push(new proveedor(correlativoSiguiente, datosGenerales));
        //actualizamos la variable en localstorage
        agregarALS(proveedores, "proveedores");
    }
    //de lo contrario agregamos un nuevo cliente al arreglo de clientes
    else {
        //llenamos el arreglo con los valores previos cargados en localstorage
        clientes = localStorage.getItem("clientes") === null ? [] : JSON.parse(localStorage.getItem('clientes'));
        //obtenemos el correlativo siguiente (idCliente) en caso ya haya cleintes ingresados
        if (clientes.length > 0) correlativoSiguiente = parseInt(clientes[clientes.length - 1].idCliente) + 1;
        //agregamos el cliente al arreglo
        clientes.push(new cliente(correlativoSiguiente, datosGenerales));
        //actualizamos la variable en localstorage
        agregarALS(clientes, "clientes");
    }
}

/**
 * Metodo para agregar movimiento de inventario.
*/
agregarMovimientoInventario = () => {
    //Validar si tiene detalle, la fecha y el resto de campos que requieran validacion
    let articulosMov = document.getElementById("tbArticulosMovimiento").rows;
    if (articulosMov.length <= 0) {
        alert("Debe agregar el detalle de productos del movimiento.");
        return;
    }

    //variable para almacenar el correlativo siguiente
    let correlativoSiguiente = 1;

    //llenamos el arreglo con los valores previos cargados en localstorage
    movimientosInventario = localStorage.getItem("movimientosInventario") === null ? [] : JSON.parse(localStorage.getItem('movimientosInventario'));

    //obtenemos el correlativo siguiente (id del movimiento) en caso ya haya movimientosInventario ingresados
    if (movimientosInventario.length > 0) correlativoSiguiente = parseInt(movimientosInventario[movimientosInventario.length - 1].idMovimiento) + 1;

    //Crear instancia de clase de movimiento de inventario    
    let tipoTransaccion = document.getElementById("movTipoTransaccion").value;
    let idAutor = '';

    //si es distinto de ajuste (-) o ajuste (+), obtener el id de cliente o proveedor como idAutor
    if (parseInt(tipoTransaccion) !== 3 && parseInt(tipoTransaccion) !== 6)
        idAutor = document.getElementById("movAutor").value;

    let movimiento = new movimientoInventario(correlativoSiguiente, idAutor, tipoTransaccion, articulosMovimiento);

    //Agregar al arreglo el objeto creado
    movimientosInventario.push(movimiento);

    //Guardar arreglo en localStorage 
    agregarALS(movimientosInventario, "movimientosInventario");

    //Sumar o restar existencia al producto oficial, segun corresponda
    articulosCatalogo = localStorage.getItem("articulosCatalogo") === null ? [] : JSON.parse(localStorage.getItem('articulosCatalogo'));

    let index = -1;
    movimiento.detalle.forEach(art => { //por cada detalle
        index = devuelveIndexProductoCodigoX(art.codigo); //buscamos el producto en el catalogo
        if (index >= 0) {
            if (movimiento.idTipoMovimiento === 1) //si es una entrada, sumamos la cantidad ingresada a la existencia
                articulosCatalogo[index].existencia = parseInt(articulosCatalogo[index].existencia) + parseInt(art.cantidad);
            else //de lo contrario, la restamos
                articulosCatalogo[index].existencia = parseInt(articulosCatalogo[index].existencia) - parseInt(art.cantidad);

            agregarALS(articulosCatalogo, "articulosCatalogo"); //agregamos el arreglo ya con los cambios para refrescar
        }
    });

    // agregarALS(articulosCatalogo, "articulosCatalogo"); //agregamos el arreglo ya con los cambios para refrescar
}

/**
 * Metodo para agregar productos al detalle del movimiento.
*/
agregarProductoDetalle = () => {
    //validar que se haya ingresado la cantidad, precio y que este marcado el codigo
    let cantidad = document.getElementById("detCantidad").value;
    let precio = document.getElementById("detPrecio").value;
    let codigo = document.getElementById("detProducto").value;
    if (!cantidad || !precio || !codigo) {
        alert("Debe elegir el articulo, ingresar cantidad y precio.");
        return;
    }

    //instanciar clase de producto y llenarla con los datos ingresados por el usuario
    let art = new articulo(codigo, document.getElementById("detDescripcion").value, precio, cantidad, "", 0);

    //almacenar producto en arreglo
    articulosMovimiento.push(art);

    //mostrar el producto elegido en la tabla
    mostrarProductosMovimiento();

    //limpiar controles
    document.getElementById("detCantidad").value = "";
}

/**
 * Metodo para agregar objeto a localstorage.
*/
agregarALS = (objeto, nombreVariable) => {
    localStorage.setItem(nombreVariable, JSON.stringify(objeto));
}

/**
 * Metodo para mostrar las transacciones de inventario que correspondan dependiendo de tipo de movimiento.
*/
mostrarTransaccionInv = () => {
    let movSalida = document.getElementById("movSalida");
    let html = ``;

    if (movSalida.checked) {
        html = `
            <label for="movTipoTransaccion">Tipo Transacción</label>
            <select id="movTipoTransaccion" name="movTipoTransaccion" onchange="mostrarAutorMovimientoInv()" required class="form-select">
                <option value="1">Venta</option>
                <option value="2">Devolución S/Compra</option>
                <option value="3">Ajuste (-)</option>
            </select>`;
    }
    else {
        html = `
            <label for="movTipoTransaccion">Tipo Transacción</label>
            <select id="movTipoTransaccion" name="movTipoTransaccion" onchange="mostrarAutorMovimientoInv()" required class="form-select">
                <option value="4">Compra</option>
                <option value="5">Devolución S/Venta</option>
                <option value="6">Ajuste (+)</option>
            </select>`;
    }

    document.getElementById("transaccion").innerHTML = html;
}

/**
 * Metodo para mostrar los clientes/proveedores dependiendo de tipo de transaccion.
*/
mostrarAutorMovimientoInv = () => {
    let tipoTransaccion = document.getElementById("movTipoTransaccion").value;
    html = "";
    switch (tipoTransaccion) {
        case "1":
        case "5":
            //muestra listado de clientes disponibles
            html =
                `<label for="movAutor">Cliente</label>
                <select id="movAutor" name="movAutor" required class="form-select">`;
            clientes = localStorage.getItem("clientes") === null ? [] : JSON.parse(localStorage.getItem('clientes'));
            clientes.forEach(cliente => {
                html +=
                    `<option value="${cliente.idCliente}">${cliente.datosGenerales.identificador} ${cliente.datosGenerales.nombre}</option>`;
            });
            html +=
                `</select>`;
            break;
        case "2":
        case "4":
            //muestra listado de proveedores disponibles
            html =
                `<label for="movAutor">Proveedor</label>
                <select id="movAutor" name="movAutor" required class="form-select">`;
            proveedores = localStorage.getItem("proveedores") === null ? [] : JSON.parse(localStorage.getItem('proveedores'));
            proveedores.forEach(proveedor => {
                html +=
                    `<option value="${proveedor.idProveedor}">${proveedor.datosGenerales.identificador} ${proveedor.datosGenerales.nombre}</option>`;
            });
            html +=
                `</select>`;
            break;
        default:
            break;
    }

    document.getElementById("autor").innerHTML = html;
}

/**
 * Metodo para mostrar los productos disponibles.
*/
mostrarProductosCatalogo = () => {
    //muestra listado de clientes disponibles
    let html =
        `<label for="detProducto">Producto</label>
        <select id="detProducto" name="detProducto" required
            onchange="mostrarDetalleProducto(this)" class="form-select">`;
    articulosCatalogo = localStorage.getItem("articulosCatalogo") === null ? [] : JSON.parse(localStorage.getItem('articulosCatalogo'));
    articulosCatalogo.forEach(art => {
        html +=
            `<option value="${art.codigo}">${art.codigo} ${art.nombre}</option>`;
    });
    html +=
        `</select>`;

    document.getElementById("articulos").innerHTML = html;
    mostrarDetalleProducto(document.getElementById("detProducto"));
}

/**
 * Metodo para mostrar los detalles del producto seleccionado.
*/
mostrarDetalleProducto = (art) => {
    let index = devuelveIndexProductoCodigoX(art.value);
    if (index >= 0) {
        document.getElementById("detDescripcion").value = articulosCatalogo[index].nombre;
        document.getElementById("detPrecio").value = articulosCatalogo[index].precio;
    }
}

/**
 * Funcion para devolver indice donde se almacena el producto con Codigo X, en catalogo de productos .
*/
devuelveIndexProductoCodigoX = (codigo) => {
    let index = -1, contador = 0;
    articulosCatalogo = localStorage.getItem("articulosCatalogo") === null ? [] : JSON.parse(localStorage.getItem('articulosCatalogo'));
    articulosCatalogo.forEach(art => {
        if (art.codigo == codigo)
            index = contador;
        contador++;
    });

    return index;
}

/**
 * Funcion para mostrar los productos que se agreguen al detalle del movimiento.
*/
mostrarProductosMovimiento = () => {
    let html = "";
    let totalGeneral = 0;

    articulosMovimiento.forEach(art => {
        let totalLinea = (parseFloat(art.cantidad) * parseFloat(art.precio)).toFixed(2);
        html +=
            `<tr id="${art.codigo}">
                <td>${art.codigo}</td>
                <td>${art.nombre}</td>
                <td>${art.cantidad}</td>
                <td>${art.precio}</td>
                <td>${totalLinea}</td>
            </tr>`;
        totalGeneral = (parseFloat(totalGeneral) + parseFloat(totalLinea)).toFixed(2);
    });

    document.getElementById("totalGeneral").innerHTML = `<strong>${totalGeneral}</strong>`;
    document.getElementById("tbArticulosMovimiento").innerHTML = html;
}