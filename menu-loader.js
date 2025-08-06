document.addEventListener('DOMContentLoaded', async () => {
    
    // ✅ ¡IMPORTANTE! REEMPLAZA ESTA LÍNEA CON LA URL DE TU SERVIDOR EN RENDER
  const API_URL = location.hostname.includes('localhost')
        ? 'http://localhost:3000/api/produits'
        : 'https://resto-diallo-api.onrender.com/api/produits';
    // Obtenemos los contenedores de cada sección
    const containers = {
        plats: document.getElementById('plats-container'),
        pates: document.getElementById('pates-container'),
        boissons: document.getElementById('boissons-container'),
        desserts: document.getElementById('desserts-container'),
        'petit-dejeuner': document.getElementById('petit-dejeuner-container'),
        'menu-weekend': document.getElementById('menu-weekend-container'),
        'menu-principal': document.getElementById('menu-principal-container')
    };

    try {
        // Usamos la variable API_URL
        console.log('Chargement du menu depuis :', API_URL);

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el menú desde el servidor.');
        }
        
        const produits = await response.json();

        produits.forEach(produit => {
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

            const container = containers[produit.categorie];
            if (container) {
                container.innerHTML += productHTML;
            }
        });

        if (window.bindAllDynamicEvents) {
            window.bindAllDynamicEvents(document.body);
        }

    } catch (error) {
        console.error("Error al cargar el menú:", error);
        const mainContainer = document.querySelector('#plats-container') || document.body;
        mainContainer.innerHTML = '<p style="color: red; text-align: center;">Lo sentimos, el menú no está disponible en este momento. Por favor, intente más tarde.</p>';
    }
});