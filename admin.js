document.addEventListener('DOMContentLoaded', () => {
    const listaProductos = document.getElementById('lista-productos');
    const form = document.getElementById('form-add-product');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const editIdInput = document.getElementById('edit-id');
    
    let allProducts = [];

    async function fetchAndDisplayProducts() {
        try {
            const API_URL = location.hostname.includes('localhost')
  ? 'http://localhost:3000/api/produits'
  : 'https://resto-diallo-api.onrender.com/api/produits';

const response = await fetch(API_URL);

            allProducts = await response.json();
            listaProductos.innerHTML = '';
            allProducts.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.nom}</td>
                    <td>${product.prix} FCFA</td>
                    <td>${product.image}</td>
                    <td>${product.categorie}</td>
                    <td>
                        <button class="edit-btn" data-id="${product.id}">Editar</button>
                        <button class="delete-btn" data-id="${product.id}">Borrar</button>
                    </td>
                `;
                listaProductos.appendChild(row);
            });
        } catch (error) {
            listaProductos.innerHTML = `<tr><td colspan="6" style="color: red;">${error.message}</td></tr>`;
        }
    }

    function resetForm() {
        form.reset();
        editIdInput.value = '';
        formTitle.textContent = 'Añadir Nuevo Producto';
        submitButton.textContent = 'Guardar Producto';
        cancelEditButton.style.display = 'none';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = editIdInput.value;
        const productData = {
            nom: document.getElementById('nombre').value,
            prix: parseInt(document.getElementById('precio').value, 10),
            image: document.getElementById('imagen').value,
            categorie: document.getElementById('categorie').value
        };

        let url = '/api/produits';
        let method = 'POST';

        if (id) {
            url = `/api/produits/${id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            alert(`¡Producto ${id ? 'actualizado' : 'guardado'} con éxito!`);
            resetForm();
            fetchAndDisplayProducts();
        } else {
            alert(`Error: El servidor no pudo ${id ? 'actualizar' : 'guardar'} el producto.`);
        }
    });

    listaProductos.addEventListener('click', async (event) => {
        const target = event.target;
        const id = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            const isConfirmed = confirm('¿Estás seguro de que quieres borrar este producto?');
            if (isConfirmed) {
                const response = await fetch(`/api/produits/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('¡Producto borrado con éxito!');
                    fetchAndDisplayProducts();
                } else {
                    alert('Error: El servidor no pudo borrar el producto.');
                }
            }
        }

        if (target.classList.contains('edit-btn')) {
            const productToEdit = allProducts.find(p => p.id == id);
            if (productToEdit) {
                document.getElementById('nombre').value = productToEdit.nom;
                document.getElementById('precio').value = productToEdit.prix;
                document.getElementById('imagen').value = productToEdit.image;
                document.getElementById('categorie').value = productToEdit.categorie;
                editIdInput.value = productToEdit.id;
                formTitle.textContent = 'Editar Producto';
                submitButton.textContent = 'Actualizar Producto';
                cancelEditButton.style.display = 'inline-block';
                window.scrollTo(0, 0);
            }
        }
    });

    cancelEditButton.addEventListener('click', resetForm);
    fetchAndDisplayProducts();
});