/**
 * Clase usuario para guardar datos de inicio de sesion.
*/
class usuario {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
    }
}

/**
 * Metodo para guardar sesion en local storage.
*/
iniciarSesion = () => {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("password").value;
    let html = "";

    if (user === "admin" && pass === "12345") {
        let usuarioAdmin = new usuario(user, pass);
        agregarALS(usuarioAdmin, "usuarioAdmin");

        html = `
        <div>
            <h4>¡Usuario Aceptado!</h4>
            <a href="../index.html">Volver al inicio</a>
        </div>`;
    }
    else {
        html = `
        <div>
            <h4>¡Usuario NO Aceptado!</h4>
            <a href="./login.html">Volver a intentarlo</a>
        </div>`;
    }

    //enviar nuevo html de la pagina
    document.getElementById("bodyLogin").innerHTML = html;
}

cerrarSesion = () => {
    localStorage.removeItem("usuarioAdmin");
    mostrarAccesosUsuarioStandar();
}

accesoAdministrador = () => {
    if (localStorage.getItem("usuarioAdmin"))
        return true;
    else
        return false;
}

/**
 * Paginas disponibles
 * 1    Carrito de Compra
 * 2    Catalogo de Productos
 * 3    Login
 * 4    Movimiento Inventario
 * 5    Pedido
 * 6    Persona
 * 7    Singin
 * 8    Tienda
 * 9    Index
*/
mostrarAccesosAdmin = (pag) => {
    html = `<ul>`;
    if (pag !== 1)
        html += `<li><a href="../pages/carritoCompra.html" target="_blank">Carrito</a></li>`;
    if (pag !== 2)
        html += `<li><a href="../pages/catalogoProductos.html" target="_blank">Productos</a></li>`;
    if (pag !== 3 && !accesoAdministrador())
        html += `<li><a href="../pages/login.html" target="_blank">Ingresar</a></li>`;
    if (pag !== 4 && accesoAdministrador())
        html += `<li><a href="../pages/movimientoInventario.html" target="_blank">Mov. Inv.</a></li>`;
    if (pag !== 6 && accesoAdministrador())
        html += `<li><a href="../pages/persona.html" target="_blank">Cliente/Proveedor</a></li>`;
    if (pag !== 7 && !accesoAdministrador())
        html += `<li><a href="../pages/signin.html" target="_blank">Regístrate</a></li>`;
    if (pag !== 8)
        html += `<li><a href="../pages/tienda.html" target="_blank">Tienda</a></li>`;
    if (pag !== 9)
        html += `<li><a href="../index.html" target="_blank">Inicio</a></li>`;
    if (accesoAdministrador())
        html += `<li><a href="../index.html" target="_blank" onclick="cerrarSesion()">Salir</a></li>`;
    html += "</ul>";

    if (pag === 9 && !accesoAdministrador()) {
        html =
            `<ul>
            <li><a href="./pages/catalogoProductos.html" target="_blank">Productos</a></li>
            <li><a href="./pages/tienda.html" target="_blank">Tienda</a></li>
            <li><a href="./pages/carritoCompra.html" target="_blank">Carrito</a></li>
            <li><a href="pages/login.html" target="_blank">Ingresar</a></li>
            <li><a href="pages/signin.html" target="_blank">Regístrate</a></li>
        </ul>`;
    }
    else if (pag === 9 && accesoAdministrador()) {
        html =
            `<ul>
            <li><a href="./pages/catalogoProductos.html" target="_blank">Productos</a></li>
            <li><a href="./pages/tienda.html" target="_blank">Tienda</a></li>
            <li><a href="./pages/carritoCompra.html" target="_blank">Carrito</a></li>
            <li><a href="./pages/movimientoInventario.html" target="_blank">Mov. Inv.</a></li>
            <li><a href="./pages/persona.html" target="_blank">Cliente/Proveedor</a></li>
            <li><a href="./index.html" target="_blank" onclick="cerrarSesion()">Salir</a></li>
        </ul>`;
    }
    
    document.getElementById("nav").innerHTML = html;
}

mostrarAccesosUsuarioStandar = () => {
    html = ``;
    document.getElementById("nav").innerHTML = html;
}






