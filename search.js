document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('recherche-input');
  const bouton = document.getElementById('recherche-btn');
  const suggestions = document.getElementById('suggestions');
  let produits = [];

  // Charger les produits
  fetch('produits.json')
    .then(res => res.json())
    .then(data => produits = data)
    .catch(err => {
      suggestions.innerHTML = '<div style="color: red;">Erreur chargement JSON</div>';
      console.error('Erreur JSON', err);
    });

  function rechercher() {
    const query = input.value.trim().toLowerCase();
    if (!query || produits.length === 0) return;

    const resultats = produits.filter(p =>
      p.nom.toLowerCase().includes(query)
    );

    suggestions.innerHTML = '';
    if (resultats.length === 0) {
      suggestions.innerHTML = '';
      return;
    }

    resultats.forEach(p => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = p.nom;
      suggestions.appendChild(div);
    });
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      rechercher();
    }
  });
div.addEventListener('click', () => {
  input.value = produit.nom;
  suggestions.innerHTML = '';
});
  bouton.addEventListener('click', rechercher);
});
