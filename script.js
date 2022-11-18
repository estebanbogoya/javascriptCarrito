let carrito = [];

// CARGANDO CARRITO DESDE EL LOCALSTORAGE

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
}

// Creando mis productos en HTML. Modificando el DOM.
// Traigo productos desde un archivo JSON utilizando fetch().

const contenedorProductos = document.getElementById("contenedorProductos");
const arrayProductos = "json/productos.json";

fetch(arrayProductos)
    .then(respuesta => respuesta.json())
    .then(datos => {
        console.log(datos);
        datos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add = ("col-xl-3", "col-md-6", "col-xs-12")
            card.innerHTML = `
                <div class ="card cards">
                    <img src = "${producto.img}" class = "card-img-top imgProductos" alt = "${producto.equipo}"
                    <div class = "card-body">
                    <h5 class = "card-title"> Camiseta del ${producto.equipo}</h5>
                    <p class = "card-text"> Precio: $${producto.precio} USD</p>
                    <button class = "btn colorBoton" id ="boton${producto.id}"> Agregar al Carrito </button>
                    </div>
                </div>`
            contenedorProductos.appendChild(card);

            // Agregar los productos!

            const boton = document.getElementById(`boton${producto.id}`);
            boton.addEventListener("click", () => {
                agregarAlCarrito(producto.id);
                Toastify({
                    text: "Producto Agregado al Carrito",
                    duration: 1000,
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            })
            const agregarAlCarrito = (id) => {
                const producto = datos.find((producto) => producto.id === id);
                const productoEnCarrito = carrito.find((producto) => producto.id === id)

                if (productoEnCarrito) {
                    productoEnCarrito.cantidad++
                } else {
                    carrito.push(producto);
                    producto.cantidad++
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                }
                calcularTotal();
            }
        })
    })
    .catch(error => console.error(error))
    .finally(() => console.log("Proceso Finalizado"));

// Mostrando el carrito:

const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
})

// Funcion para mostrarlo:

const mostrarCarrito = () => {
    if (carrito.length === 0) {
        carritoVacio()
    }

    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add = ("col-xl-3", "col-md-6", "col-xs-12")
        card.innerHTML = `
        <div class ="card cards">
            <img src = "${producto.img}" class = "card-img-top imgProductos" alt = "${producto.equipo}"
            <div class = "card-body">
            <h5 class = "card-title"> Camiseta del ${producto.equipo}</h5>
            <p class = "card-text"> Precio: $${producto.precio * producto.cantidad} USD</p>
            <div class = "card-text"> 
                <div class = "wrapper">
                    <span class = "minus" id = "menos${producto.id}">-</span>
                    <span class = "num">${producto.cantidad}</span>
                    <span class = "plus" id = "mas${producto.id}">+</span>
                </div>
            </div>
            <button class = "btn colorBoton" id ="eliminar${producto.id}"> Eliminar Producto </button>
            </div>
        </div>`
        contenedorCarrito.appendChild(card);


        //Eliminar Producto.

        const boton = document.getElementById(`eliminar${producto.id}`)
        boton.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
            producto.cantidad = 0
            calcularTotal();
        })
        calcularTotal();

        const menos = document.getElementById(`menos${producto.id}`)
        const mas = document.getElementById(`mas${producto.id}`)

        menos.addEventListener("click", () => {
            bajarcantidad(producto.id);
        })

        mas.addEventListener("click", () => {
            aumentarcantidad(producto.id);
        })

    })
}

// Aumentar y Bajar cantidad!

// Bajar cantidad usando el boton -

const bajarcantidad = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const productoEnCarrito = carrito.find((producto) => producto.id === id)

    if (productoEnCarrito) {
        productoEnCarrito.cantidad--
    }

    if (productoEnCarrito.cantidad < 1) {
        eliminarDelCarrito(producto.id)
        calcularTotal();
        localStorage.remove(producto.id)
    }

    calcularTotal();
    mostrarCarrito();

}

// Aumentar la cantidad usando el boton +

const aumentarcantidad = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const productoEnCarrito = carrito.find((producto) => producto.id === id)

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++
    } else {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    calcularTotal();
    mostrarCarrito();
}
//Eliminando un producto

const eliminarDelCarrito = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1)
    Toastify({
        text: "Producto Eliminado del Carrito",
        duration: 1000,
        gravity: "bottom",
        position: "right",
        style:
        {
            background: "red"
        }
    }).showToast();
    mostrarCarrito();


    localStorage.setItem("carrito", JSON.stringify(carrito))
}

//Vaciar Carrito

const vaciarCarrito = document.getElementById("vaciarCarrito")

vaciarCarrito.addEventListener("click", () => {
    if (carrito.length > 0) {
        Swal.fire({
            title: 'Estas seguro de vaciar el carrito?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo!'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTodoElCarrito();
                mostrarCarrito();
                calcularTotal();
                Swal.fire(
                    'El carrito ahora esta vacio!',
                    'Vuelve a seleccionar tus productos.',
                    'success'
                )

            }
        })
    } else {
        carritoVacio();
    }
})

// Mostrar total de la compra.

const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0
    carrito.forEach((producto) => {
        totalCompra += producto.precio * producto.cantidad;
    })
    total.innerHTML = `$${totalCompra} USD`;
}

// Finalizar la compra.

const finalizarCompra = document.getElementById("finalizarCompra")

finalizarCompra.addEventListener("click", () => {
    completePurchase();
})

function completePurchase() {
    if (carrito.length > 0) {
        Swal.fire({
            title: `Estas seguro que deseas finalizar tu compra?`,
            icon: "warning",
            background: "white",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#B7950B",
            confirmButtonColor: "#B7950B"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Compra Finalizada. Gracias por tu compra!",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#B7950B"
                })
                eliminarTodoElCarrito();
                calcularTotal();
                mostrarCarrito();
            }
        })
    } else {
        Toastify({
            text: "No has seleccionado ningun producto para comprar",
            duration: 2000,
            gravity: "bottom",
            position: "right",
            style:
            {
                background: "red"
            }
        }).showToast();
    }

}

function eliminarTodoElCarrito() {
    for (const producto of carrito) {
        producto.cantidad = 0
    }
    carrito.length = 0
}

function carritoVacio(){
    Toastify({
        text: "El Carrito esta vacio",
        duration: 1000,
        gravity: "bottom",
        position: "right",
        style:
        {
            background: "red"
        }

    }).showToast()
}