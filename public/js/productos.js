const productosApi = {
    get: () => {
        return fetch('/api/productos')
            .then(data => data.json())
    },
    post: (nuevoProd) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProd)
        }
        return fetch('/api/productos', options)
    },
    put: (idProd, nuevoProd) => {
        const options = {
            method: 'PUT',
            body: JSON.stringify(nuevoProd),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return fetch(`/api/productos/${idProd}`, options)
    },
    delete: (idProd) => {
        const options = {
            method: 'DELETE'
        }
        return fetch(`/api/productos/${idProd}`, options)
    },
}

//-------------------------------------------------------------------
// productos
const formAgregarProducto = document.getElementById('formAgregarProducto')

formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = leerProductoDelFormulario(e.target)
    productosApi.post(producto)
        .then((response) => {
            if (!response.ok) {
                response.json().then(({ descripcion }) => {
                    alert(descripcion)
                })
            }
            actualizarListaProductos()
        })
        .then(() => {
            formAgregarProducto.reset()
        })
        .catch((err) => {
            console.log(err);
        })
})

const leerProductoDelFormulario = () => {
    const formData = new FormData(formAgregarProducto);
    const { title, price, stock, thumbnail, description } = Object.fromEntries(formData);

    const producto = {
        title,
        price,
        stock,
        thumbnail,
        description
    }
    return producto
}

const actualizarListaProductos = () => {
    return productosApi.get()
        .then(prods => makeHtmlTableProducts(prods))
        .then(html => {
            document.getElementById('productos').innerHTML = html
        })
}

const borrarProducto = (idProd) => {
    productosApi.delete(idProd)
        .then((response) => {
            if (!response.ok) {
                response.json().then(({ descripcion }) => {
                    alert(descripcion)
                })
            }
            actualizarListaProductos()
        })
        .catch((err) => {
            console.log(err);
        })
}

const actualizarProducto = (idProd) => {
    const nuevoProd = leerProductoDelFormulario()
    productosApi.put(idProd, nuevoProd)
        .then((response) => {
            if (!response.ok) {
                response.json().then(({ descripcion }) => {
                    alert(descripcion)
                })
            }
            actualizarListaProductos().then(() => {
                formAgregarProducto.reset()
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

const llenarFormulario = (title = '', price = '', stock = '', thumbnail = '', description = '') => {
    formAgregarProducto[0].value = title
    formAgregarProducto[1].value = price
    formAgregarProducto[2].value = stock
    formAgregarProducto[3].value = thumbnail
    formAgregarProducto[4].value = description
}

const makeHtmlTableProducts = (productos) => {
    let html = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>`

    if (productos.length > 0) {
        html += `
        <h3 class="text-primary">Product List</h3>
        <div class="table-responsive">
            <table class="table table-default table-striped table-bordered mt-2 align-middle text-center ">
                <thead>
                    <tr class="text-primary table-secondary">
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Created date</th>
                        <th>Picture</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`
        for (const prod of productos) {
            html += `
                    <tr>
                        <td>
                            <a type="button" class="link-primary" onclick="llenarFormulario('${prod.title}', '${prod.price}', '${prod.stock}', '${prod.thumbnail}', '${prod.description}')" title="copiar a formulario...">${prod.title}</a>
                        </td>
                        <td>€${prod.price}</td>
                        <td>${prod.stock}</td>
                        <td>${new Date(prod.timestamp).toLocaleString()}</td>
                        <td>
                            <img width="50" src=${prod.thumbnail} alt="not found">
                        </td>
                        <td>
                            <button type="button" onclick="borrarProducto('${prod.id}')" class="btn btn-danger btn-sm" title="Delete">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                            <button type="button" onclick="actualizarProducto('${prod.id}')" class="btn btn-primary btn-sm" title="Modify">
                            <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </td>
                    </tr>`
        }
        html += `
                </tbody>
            </table>
        </div >`
    }
    return Promise.resolve(html)
}

actualizarListaProductos()