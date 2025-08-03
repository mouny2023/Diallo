document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('recherche-input');
  const bouton = document.getElementById('recherche-btn');
  const suggestions = document.getElementById('suggestions');
  let produits = [];

  // Charger les produits depuis le fichier JSON
  fetch('produits.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      produits = data;
    })
    .catch(err => {
      suggestions.innerHTML = '<div style="color: red;">Erreur: Impossible de charger les produits.</div>';
      console.error('Erreur lors du chargement du JSON:', err);
    });

  function rechercher() {
    const query = input.value.trim().toLowerCase();
    suggestions.innerHTML = ''; // Vider les suggestions à chaque recherche

    if (!query || produits.length === 0) {
      return;
    }

    const resultats = produits.filter(p =>
      p.nom.toLowerCase().includes(query)
    );
    resultats.forEach(p => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = p.nom;

      // Ajouter l'événement de clic pour chaque suggestion
      div.addEventListener('click', () => {
        input.value = p.nom; // Mettre à jour l'input avec le nom cliqué
        suggestions.innerHTML = ''; // Cacher les suggestions
      });

      suggestions.appendChild(div);
    });
  }

  // Amélioration : Lancer la recherche pendant la saisie
  input.addEventListener('input', rechercher);
  
  // Garder la recherche au clic sur le bouton
  bouton.addEventListener('click', rechercher);

  // Gérer la touche "Entrée"
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Empêche le formulaire de s'envoyer
      // On peut cacher les suggestions ici si on veut
      suggestions.innerHTML = ''; 
    }
  });
});