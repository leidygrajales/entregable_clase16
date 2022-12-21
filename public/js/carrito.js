const productosApi = {
    get: () => {
        return fetch('/api/productos')
            .then(data => data.json())
    }
}

const carritosApi = {
    crearCarrito: () => {
        const options = { method: "POST" }
        return fetch('/api/carrito', options)
            .then(data => data.json())
    },
    getIds: () => {
        return fetch('/api/carrito')
            .then(data => data.json())
    },
    postProd: (idCarrito, idProd) => {
        const data = { id: idProd }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        return fetch(`/api/carrito/${idCarrito}/products`, options)
    },
    getProds: idCarrito => {
        return fetch(`/api/carrito/${idCarrito}/products`)
            .then(data => data.json())
    },
    deleteProd: (idCarrito, idProducto) => {
        const options = {
            method: 'DELETE',
        }
        return fetch(`/api/carrito/${idCarrito}/products/${idProducto}`, options)
    }
}

const loadComboCarrito = () => {
    return carritosApi.getIds()
        .then(carts => {
            const combo = document.getElementById('comboCarritos');
            vaciarCombo(combo)
            combo.appendChild(crearOpcionInicial('Choose a cart'))
            carts.map(({ id }) => {
                const comboItem = document.createElement("option");
                comboItem.value = id;
                comboItem.text = id;
                combo.appendChild(comboItem);
            })

        })
}



document.getElementById('btnAgregarAlCarrito').addEventListener('click', () => {
    const idCarrito = document.getElementById('comboCarritos').value
    const idProd = document.getElementById('comboProductos').value
    if (idCarrito && idProd) {
        agregarAlCarrito(idCarrito, idProd)
    } else {
        alert('debe seleccionar un carrito y un producto')
    }
})

document.getElementById('btnCrearCart').addEventListener('click', () => {
    carritosApi.crearCarrito()
        .then(({ id }) => {
            loadComboCarrito().then(() => {
                const combo = document.getElementById('comboCarritos')
                combo.value = `${id}`
                combo.dispatchEvent(new Event('change'));
            })
        })
})

document.getElementById('comboCarritos').addEventListener('change', () => {
    const idCarrito = document.getElementById('comboCarritos').value
    actualizarListaCarrito(idCarrito)
})

function agregarAlCarrito(idCarrito, idProducto) {
    return carritosApi.postProd(idCarrito, idProducto).then(() => {
        actualizarListaCarrito(idCarrito)
    })
}

function quitarDelCarrito(idProducto) {
    const idCarrito = document.getElementById('comboCarritos').value
    return carritosApi.deleteProd(idCarrito, idProducto).then(() => {
        actualizarListaCarrito(idCarrito)
    })
}

const actualizarListaCarrito = (idCarrito) => {
    return carritosApi.getProds(idCarrito)
        .then(prods => makeHtmlTable(prods))
        .then(html => {
            document.getElementById('cart').innerHTML = html
        })
}

const makeHtmlTable = (productos) => {

    console.log('productos', productos)
    let html = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>`

    if (productos.length > 0) {
        html += `
        <h3 class="text-primary">Cart Products</h3>
        <div class="table-responsive">
            <table class="table table-default table-striped table-bordered mt-2 align-middle text-center ">
                <thead>
                    <tr class="text-primary table-secondary">
                        <th>Name</th>
                        <th>Price</th>
                        <th>Picture</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>`
        for (const prod of productos) {
            html += `
                    <tr>
                        <td>${prod.title}</td>
                        <td>$${prod.price}</td>
                        <td><img width="50" src=${prod.thumbnail} alt="not found"></td>
                        <td>
                            <button type="button" onclick="quitarDelCarrito('${prod.id}')" class="btn btn-danger btn-sm" title="Delete">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>`
        }
        html += `
                </tbody>
            </table>
        </div >`
    } else {
        html += `<br><h4>carrito sin productos</h2>`
    }
    return Promise.resolve(html)
}

function crearOpcionInicial(leyenda) {
    const defaultItem = document.createElement("option")
    defaultItem.value = ''
    defaultItem.text = leyenda
    defaultItem.hidden = true
    defaultItem.disabled = true
    defaultItem.selected = true
    return defaultItem
}

function loadComboProductos() {
    return productosApi.get()
        .then(productos => {
            const combo = document.getElementById('comboProductos');
            combo.appendChild(crearOpcionInicial('Choose a product'))
            for (const prod of productos) {
                const comboItem = document.createElement("option");
                comboItem.value = prod.id;
                comboItem.text = prod.title;
                combo.appendChild(comboItem);
            }
        })
}

function vaciarCombo(combo) {
    while (combo.childElementCount > 0) {
        combo.remove(0)
    }
}

loadComboProductos()

loadComboCarrito()