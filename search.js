document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('recherche-input');
  const suggestions = document.getElementById('suggestions');
  let produits = [];

  // Étape 1 : Charger les produits depuis le fichier externe
  fetch('produits.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erreur chargement JSON: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      produits = data;
    })
    .catch(err => {
      console.error("Impossible de charger produits.json:", err);
    });

  // Étape 2 : La fonction de recherche
  function rechercher() {
    const query = input.value.trim().toLowerCase();
    suggestions.innerHTML = ''; 

    if (!query) { return; }

    const resultats = produits.filter(p =>
      p.nom.toLowerCase().includes(query)
    );

    resultats.forEach(p => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = p.nom;

      div.addEventListener('click', () => {
        input.value = p.nom; 
        suggestions.innerHTML = '';
      });

      suggestions.appendChild(div);
    });
  }

  // Étape 3 : Les écouteurs d'événements
  input.addEventListener('input', rechercher);

  document.addEventListener('click', (e) => {
    // Cacher les suggestions si on clique en dehors de la zone de recherche
    if (!suggestions.contains(e.target) && e.target !== input) {
        suggestions.innerHTML = '';
    }
  });
});