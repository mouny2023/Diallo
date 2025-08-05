document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('recherche-input');
  const rechercheModal = document.getElementById('recherche-modal');
  const fermerRechercheModal = document.getElementById('fermer-recherche-modal');
  const conteneurResultats = document.getElementById('recherche-resultats');
  
  let tousLesPlatsHTML = {};
  let listeProduits = [];

  // Étape 1 : On récupère la liste des noms depuis le backend
  fetch('http://localhost:3000/api/produits')
    .then(res => {
      if (!res.ok) throw new Error('Erreur réseau');
      return res.json();
    })
    .then(data => {
      listeProduits = data;
      // On associe à chaque produit son HTML complet trouvé sur la page
      listeProduits.forEach(produit => {
        const platOriginal = Array.from(document.querySelectorAll('.plat h3')).find(h3 => h3.textContent.trim() === produit.nom)?.closest('.plat');
        if (platOriginal) {
          produit.html = platOriginal.outerHTML;
        }
      });
    })
    .catch(error => console.error("Impossible de charger la liste des produits:", error));


  // Fonction qui affiche les résultats dans le modal
  function rechercher() {
    const query = input.value.trim().toLowerCase();

    if (query.length > 1) { // On affiche le modal si on a au moins 2 lettres
      rechercheModal.classList.remove('hidden');
    } else {
      rechercheModal.classList.add('hidden');
      return;
    }
    
    conteneurResultats.innerHTML = ''; // On vide les anciens résultats

    const resultats = listeProduits.filter(produit => 
      produit.nom.toLowerCase().includes(query)
    );

    if (resultats.length > 0) {
      resultats.forEach(produit => {
        // On insère directement le HTML complet et original du plat
        if (produit.html) {
          conteneurResultats.innerHTML += produit.html;
        }
      });
      
      // On active les boutons (+, -, Ajouter au panier) sur les nouveaux résultats
      if (window.PanierManager) {
        PanierManager.activerBoutons(conteneurResultats);
      }
    } else {
      conteneurResultats.innerHTML = '<p style="text-align: center;">Aucun produit trouvé.</p>';
    }
  }
  
  // --- Écouteurs d'événements ---

  let delaiRecherche;
  input.addEventListener('input', () => {
    clearTimeout(delaiRecherche);
    delaiRecherche = setTimeout(rechercher, 300); // Attend 300ms après la dernière frappe
  });

  // Pour fermer le modal
  if (fermerRechercheModal) {
    fermerRechercheModal.addEventListener('click', () => {
      rechercheModal.classList.add('hidden');
    });
  }

  if (rechercheModal) {
    rechercheModal.addEventListener('click', (e) => {
      // Si on clique sur le fond et non sur le contenu
      if (e.target === rechercheModal) {
        rechercheModal.classList.add('hidden');
      }
    });
  }
});