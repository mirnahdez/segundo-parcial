//clase para los artículos
class articulo {
    constructor(codigo, nombre, precio, cantidad, imagen, existencia) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.imagen = imagen;
        this.existencia = existencia;
    }
}

//arreglo para almacenar los artículos creados
var articulosCatalogo = [];

//arreglo para almacenar los artículos del carrito de compra
var articulosCarritoCompra = [];

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

async function agregarArticuloCatalogo() {
    let codigo = document.getElementById("codigo").value;
    let nombre = document.getElementById("nombre").value;
    let precio = document.getElementById("precio").value;
    let existencia = document.getElementById("existencia").value;
    let sa = document.getElementById("imagen");
    let existeImagen = true;
    let ar = sa.files;
    let imagenB64 = "";

    if (!ar || !ar.length) {
        existeImagen = false;
        if (!confirm(" Producto se guardará sin imagen. ¿Desea continuar?")) {
            return;
        }
    }

    if (existeImagen) {
        let imagen = ar[0];
        imagenB64 = await convertFileToBase64(imagen);
    }

    //si todos los campos enviados tienen información
    if (codigo && nombre && precio && existencia) {

        //agregar artículo
        nuevoArticulo = new articulo(codigo, nombre, precio, 0, imagenB64, existencia);
        articulosCatalogo.push(nuevoArticulo);

        //mostrar cambios en tabla
        enviarHTMLTBody(articulosCatalogo);

        //limpiar controles
        limpiarControles();

        //agregar información al localStorage para visualizarla desde otras páginas
        agregarALS(articulosCatalogo, "articulosCatalogo");
    }
    else
        alert("Debe llenar todos los campos (código, nombre, precio, imagen, existencia).")
}

function enviarHTMLTBody(arreglo) {
    let html = "";

    for (i = 0; i < arreglo.length; i++) {
        html += `                    
        <tr>
            <td>${arreglo[i].codigo}</td>
            <td>${arreglo[i].nombre}</td>
            <td>${arreglo[i].precio}</td>
            <td>${arreglo[i].existencia}</td>
            <td><img src="${arreglo[i].imagen}" alt="${arreglo[i].codigo}"></td>
            <td>
                <button class="btn btn-block btn-outline-success" id="btnEditar.${i + 1}" onclick="editarArticuloCatalogo(this)">Editar</button>
                <!-- <button id="btnEliminar.${i + 1}" onclick="eliminarArticuloCatalogo(this)">Eliminar</button> -->
            </td>
        </tr>`
    }

    document.getElementById("tbArticulosCatalogo").innerHTML = html;
}

function enviarHTMLTBody1() {
    articulosCatalogo = localStorage.getItem("articulosCatalogo") === null ? [] : JSON.parse(localStorage.getItem('articulosCatalogo'));
    enviarHTMLTBody(articulosCatalogo);
}

function limpiarControles() {
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
}

function editarArticuloCatalogo(btn) {
    //determinar el elemento a editar del array 
    let idArticuloEliminar = btn.id.split(".")[1] - 1;

    //crear objeto con esos datos 
    articuloTemp = articulosCatalogo[idArticuloEliminar];

    //eliminar artículo del array
    articulosCatalogo.splice(idArticuloEliminar, 1);

    //mostrar datos en input para que se realicen los cambios (al guardar cambios automáticamente se agregará el artículo al objeto de nuevo)
    document.getElementById("codigo").value = articuloTemp.codigo;
    document.getElementById("nombre").value = articuloTemp.nombre;
    document.getElementById("precio").value = articuloTemp.precio;
}

function eliminarArticuloCatalogo(btn) {
    //determinar el elemento a eliminar del array 
    let idArticuloEliminar = btn.id.split(".")[1] - 1;

    //eliminar el elemento del array
    articulosCatalogo.splice(idArticuloEliminar, 1);

    //enviar html a la tabla nuevamente
    enviarHTMLTBody(articulosCatalogo);
}

//carrito de compra
function enviarHTMLTBodyTienda() {
    let html = "";
    let i = 1;

    articulosCatalogo = localStorage.getItem("articulosCatalogo") === null ? [] : JSON.parse(localStorage.getItem('articulosCatalogo'));
    articulosCatalogo.forEach(art => {
        html += `                    
        <tr>
            <td><input type="checkbox" name="articuloCarritoFlagAgregar.${i}" id="articuloCarritoFlagAgregar.${i}"></td>
            <td><input type="number" name="articuloCarritoCantidad.${i}" id="articuloCarritoCantidad.${i}"></td>
            <td id="articuloCarritoCodigo.${i}">${art.codigo}</td>
            <td id="articuloCarritoNombre.${i}">${art.nombre}</td>
            <td id="articuloCarritoPrecio.${i}">${art.precio}</td>
            <td id="articuloCarritoPrecio.${i}">${art.existencia}</td>
            <td><img id="articuloCarritoImagen.${i}" src="${art.imagen}" alt="${art.codigo}"></td>
        </tr>`
        i++;
    });

    document.getElementById("tbArticulosCatalogo").innerHTML = html;
}

function agregarArticulosCarritoCompra() {
    let errores = "";
    
    //agregamos al arreglo la informacion del carrito de compra existente
    articulosCarritoCompra = localStorage.getItem("articulosCarritoCompra") === null ? [] : JSON.parse(localStorage.getItem('articulosCarritoCompra'));

    //por cada artículo de la tabla de productos disponibles
    for (let i = 0; i < document.getElementById("tbArticulosCatalogo").rows.length; i++) {

        //si el producto está marcado para agregar al carrito 
        if (document.getElementById(`articuloCarritoFlagAgregar.${i + 1}`).checked) {

            //si colocaron la cantidad
            if (document.getElementById(`articuloCarritoCantidad.${i + 1}`).value) {

                //agregamos artículo al arreglo
                articulosCarritoCompra.push(
                    new articulo(document.getElementById(`articuloCarritoCodigo.${i + 1}`).innerText,
                        document.getElementById(`articuloCarritoNombre.${i + 1}`).innerText,
                        document.getElementById(`articuloCarritoPrecio.${i + 1}`).innerText,
                        document.getElementById(`articuloCarritoCantidad.${i + 1}`).value,
                        document.getElementById(`articuloCarritoImagen.${i + 1}`).src,
                        0
                    ))
            }
            else //de lo contrario concatenamos un error a la variable de errores
                errores += ` Código ${document.getElementById(`articuloCarritoCodigo.${i + 1}`).innerText} no se cargará ya que no se colocó una cantidad válida.`;
        }
    }

    // //agregamos a local storage los artículos
    agregarALS(articulosCarritoCompra, "articulosCarritoCompra");

    //eliminar cantidades en la página y dejar los checkbox desmarcados
    for (i = 0; i < parseInt(localStorage.getItem("longitudArticulosCatalogo")); i++) {
        document.getElementById(`articuloCarritoFlagAgregar.${i + 1}`).checked = false;
        document.getElementById(`articuloCarritoCantidad.${i + 1}`).value = "";
    }

    //si existen errores, lanzar excepción 
    if (errores)
        alert(errores);
}

function enviarHTMLTBodyCarritoCompra() {
    let html = "";
    let i = 1;

    articulosCarritoCompra = localStorage.getItem("articulosCarritoCompra") === null ? [] : JSON.parse(localStorage.getItem('articulosCarritoCompra'));
    articulosCarritoCompra.forEach(art => {
        html += `                    
        <tr>
            <!-- <td><input type="checkbox" name="articuloCarritoCompraFlag.${i}" id="articuloCarritoCompraFlag.${i}"></td> -->
            <td><input type="number" name="articuloCarritoCantidad.${i}" id="articuloCarritoCantidad.${i}" value="${art.cantidad}"></td>
            <td id="articuloCarritoCodigo.${i}">${art.codigo}</td>
            <td id="articuloCarritoNombre.${i}">${art.nombre}</td>
            <td id="articuloCarritoPrecio.${i}">${art.precio}</td>
            <td><img id="articuloCarritoImagen.${i}" src="${art.imagen}" alt="${art.codigo}"></td>
        </tr>`
        i++;
    });

    document.getElementById("tbArticulosCarritoCompra").innerHTML = html;
}

function confirmarCarritoCompra() {
    if (confirm("¿Está seguro de confirmar el carrito de compra?")) {
        let html = `
        <form action="">
            <fieldset>
                <legend>Datos del Cliente</legend>
                <div>
                    <label for="nit">NIT</label>
                    <input type="text" id="nit" name="nit" class="form-control">
                </div>
                <div>
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" class="form-control">
                </div>
                <div>
                    <label for="telefono">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" class="form-control">
                </div>
                <div>
                    <label for="email">E-mail</label>
                    <input type="text" id="email" name="email" class="form-control">
                </div>
            </fieldset>
            <fieldset>
                <legend>Datos de Entrega</legend>
                <div>
                    <label for="direccion">Dirección</label>
                    <textarea name="direccion" id="direccion" cols="30" rows="5" class="form-control"></textarea>
                </div>
                <div>
                    <label for="comentario">Información Adicional</label>
                    <input type="text" id="comentario" name="comentario" class="form-control">
                </div>
            </fieldset>
        </form>
        <input type="button" value="Enviar Pedido" onclick="enviarDescartarPedido(this)" id="enviarPedido" class="btn btn-block btn-outline-success">
        <input type="button" value="Descartar Carrito de Compra" onclick="enviarDescartarPedido(this)" id="descartarPedido" class="btn btn-block btn-outline-warning">`;

        document.getElementById("opcionesCarritoCompra").innerHTML = html;
    }
}

function enviarDescartarPedido(btn) {
    let mensaje = "";
    if (btn.id == "enviarPedido")
        mensaje = "¿Está seguro de realizar el pedido?";
    else
        mensaje = "¿Está seguro de descartar el carrito de compra?";

    if (confirm(mensaje)) {
        let html = ``;

        //Si es el boton de enviar pedido, enviamos mensaje indicando que ya se envio el carrito de compra
        if (btn.id == "enviarPedido")
            html = `
            <div>
                <h4>¡Tu pedido ha sido enviado!</h4>
                <p>Los detalles de la orden han sido enviados a tu correo, puedes llamarnos al +502-2295-4545 en caso de consultas o reclamos relacionados con tu pedido.</p>
                <a href="../index.html">Volver al inicio</a>
            </div>`;
        else
            html = `
            <div>
                <h4>Carrito de Compra Descartado...</h4>
                <p>Esperamos te des la oportunidad de conocer nuestros productos, por eso te invitamos a echar un vistazo nuevamente a nuestra tienda.</p>
                <a href="../index.html">Volver al inicio</a>
                <a href="../pages/tienda.html">Tienda</a>
            </div>`;

        document.getElementById("bodyCarritoCompra").innerHTML = html;

        // //eliminamos local storage del carrito de compra 
        localStorage.removeItem("articulosCarritoCompra");
    }
}
