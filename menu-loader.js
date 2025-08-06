document.addEventListener('DOMContentLoaded', async () => {
    // Obtenemos los contenedores de cada sección
    const containers = {
        plats: document.getElementById('plats-container'),
        pates: document.getElementById('pates-container'),
        boissons: document.getElementById('boissons-container'),
        desserts: document.getElementById('desserts-container'),
        'petit-dejeuner': document.getElementById('petit-dejeuner-container'),
        'menu-weekend': document.getElementById('menu-weekend-container')
    };

    try {
        const response = await fetch('/api/produits');
        const produits = await response.json();

        produits.forEach(produit => {
            // Reutilizamos el mismo HTML para cada tarjeta de producto
            const productHTML = `
                <div class="plat" data-id="${produit.id}">
                  <img src="${produit.image}" alt="${produit.nom}">
                  <h3>${produit.nom}</h3>
                  <p class="prix-unite">Prix : ${produit.prix} FCFA</p>
                  <div class="quantite-wrapper">
                    <button class="moins bouton-quantite">−</button>
                    <input type="text" class="quantite" value="1" readonly>
                    <button class="plus bouton-quantite">+</button>
                  </div>
                  <button class="ajouter-panier bouton-produit">Ajouter au panier</button>
                </div>
            `;

            // Buscamos el contenedor correcto según la categoría del producto
            const container = containers[produit.categorie];
            if (container) {
                container.innerHTML += productHTML;
            }
        });

        // IMPORTANTE: Después de añadir todos los productos, reactivamos los botones de añadir al carrito
        if (window.bindAllDynamicEvents) {
            window.bindAllDynamicEvents(document.body);
        }

    } catch (error) {
        console.error("Error al cargar el menú:", error);
    }
});