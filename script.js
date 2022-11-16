//Clase camisetas que son mi "base de datos"

class Camiseta {
    constructor(id, equipo, precio, img) {
        this.id = id
        this.equipo = equipo
        this.precio = precio
        this.img = img
        this.cantidad = 0
    }

}

let carrito = [];
// CARGANDO CARRITO DESDE EL LOCALSTORAGE

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
}

const camiseta_FCB = new Camiseta(1, "FC Barcelona", 125, "imagenes/FCB.jpg")
const camiseta_RMA = new Camiseta(2, "Real Madrid", 120, "imagenes/RealM.jpg")
const camiseta_ACM = new Camiseta(3, "AC Milan", 115, "imagenes/ACM.jpg")
const camiseta_Bayern = new Camiseta(4, "Bayern Munich", 119, "imagenes/Bayern.jpg")
const camiseta_ATM = new Camiseta(5, "Atletico", 90, "imagenes/ATM.jpg")
const camiseta_PSG = new Camiseta(6, "PSG", 85, "imagenes/PSG.jpg")

const arrayProductos = [camiseta_FCB, camiseta_RMA, camiseta_ACM, camiseta_Bayern, camiseta_ATM, camiseta_PSG]

// Creando mis productos en HTML. Modificando el DOM.

const contenedorProductos = document.getElementById("contenedorProductos");

const mostrarProductos = () => {
    arrayProductos.forEach(producto => {
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

    })
}




const agregarAlCarrito = (id) => {
    const producto = arrayProductos.find((producto) => producto.id === id);
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

mostrarProductos();

// Mostrando el carrito:

const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
})

// Funcion para mostrarlo:

const mostrarCarrito = () => {
    if (carrito.length === 0) {
        Toastify({
            text: "El Carrito esta vacio",
            duration: 1000,
            gravity: "bottom",
            position: "right",
            style:
            {
                background: "red"
            }
        
    }).showToast()}

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

finalizarCompra.addEventListener("click", ()=>{
    completePurchase();
})

function completePurchase(){
    if (carrito.length>0) {
        Swal.fire({
            title: `Estas seguro que deseas finalizar tu compra?`,
            icon: "warning",
            background: "white",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#B7950B",
            confirmButtonColor: "#B7950B"
        }).then((result) =>{
            if (result.isConfirmed) {
                Swal.fire({
                    title:"Compra Finalizada. Gracias por tu compra!",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor:"#B7950B"
                })
                vaciarCarrito();
                calcularTotal();
                mostrarCarrito();
            }
        })
    }else{
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

function vaciarCarrito(){
    for (const producto of carrito) {
        producto.cantidad = 0
    }
    carrito.length = 0
}