document.addEventListener('DOMContentLoaded', () => {

    // ✅ IMPORTANT ! REMPLACE CETTE LIGNE PAR L'URL DE TON SERVEUR SUR RENDER
    const API_URL = 'https://resto-diallo-api.onrender.com/api/produits';

    const searchInput = document.getElementById('recherche-input');
    const searchButton = document.getElementById('recherche-btn');
    const searchModal = document.getElementById('recherche-modal');
    const resultsContainer = document.getElementById('recherche-resultats');
    const closeModalButton = document.getElementById('fermer-recherche-modal');

    if (!searchInput || !searchButton || !searchModal || !resultsContainer || !closeModalButton) {
        console.error("Un ou plusieurs éléments HTML de la recherche sont manquants.");
        return;
    }
    
    const fetchProducts = async () => {
        try {
            // On utilise la variable API_URL pour contacter le serveur sur Render
            const API_URL = location.hostname.includes('localhost')
  ? 'http://localhost:3000/api/produits'
  : 'https://resto-diallo-api.onrender.com/api/produits';

const response = await fetch(API_URL);

            
            if (!response.ok) {
                throw new Error('Erreur réseau ou le serveur ne répond pas.');
            }
            return await response.json();
        } catch (error) {
            console.error("Impossible de charger les produits:", error);
            resultsContainer.innerHTML = `<p>Impossible de charger le menu. Veuillez réessayer plus tard.</p>`;
            return [];
        }
    };

    const performSearch = async () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length === 0) return;

        const allProducts = await fetchProducts();
        if (allProducts.length === 0) {
            searchModal.classList.remove('hidden');
            return;
        }

        const filteredProducts = allProducts.filter(product => 
            product && product.nom && product.nom.toLowerCase().includes(query)
        );

        displayResults(filteredProducts);
    };

    const displayResults = (products) => {
        resultsContainer.innerHTML = '';

        if (products.length === 0) {
            resultsContainer.innerHTML = '<p>Aucun produit ne correspond à votre recherche.</p>';
        } else {
            products.forEach(produit => {
                const prix = produit.prix || '?';
                const image = produit.image || 'images/placeholder.png';

                const productHTML = `
                    <div class="plat">
                      <img src="${image}" alt="${produit.nom}">
                      <h3>${produit.nom}</h3>
                      <p class="prix-unite">Prix : ${prix} FCFA</p>
                      <div class="quantite-wrapper">
                        <button class="moins">−</button>
                        <input type="text" class="quantite" value="1" readonly>
                        <button class="plus">+</button>
                      </div>
                      <button class="ajouter-panier">Ajouter au panier</button>
                    </div>
                `;
                resultsContainer.innerHTML += productHTML;
            });

            if (window.bindAllDynamicEvents) {
                window.bindAllDynamicEvents(resultsContainer);
            } else {
                console.error("Erreur: La fonction bindAllDynamicEvents n'est pas trouvée.");
            }
        }
        searchModal.classList.remove('hidden');
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') performSearch();
    });
    closeModalButton.addEventListener('click', () => searchModal.classList.add('hidden'));
    searchModal.addEventListener('click', (event) => {
        if (event.target === searchModal) searchModal.classList.add('hidden');
    });
});