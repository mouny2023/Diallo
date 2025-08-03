document.addEventListener('DOMContentLoaded', function () {
  let panier = [];

  function updateCartCount() {
    const totalCount = panier.reduce((sum, item) => sum + item.quantite, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = totalCount;
  }

  function majPanier() {
    const liste = document.getElementById('panier-liste');
    const total = document.getElementById('panier-total');
    const panierContainer = document.querySelector('.panier-container');
    if (!liste || !total) return;

    liste.innerHTML = '';
    let somme = 0;
    panier.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.nom} x${item.quantite} - ${item.prix * item.quantite} FCFA`;
      liste.appendChild(li);
      somme += item.prix * item.quantite;
    });

    total.textContent = somme + " FCFA";
    updateCartCount();
    panierContainer?.classList.toggle('hidden', panier.length === 0);
  }

  function bindQuantiteButtons() {
    document.querySelectorAll('.plat').forEach(plat => {
      const moins = plat.querySelector('.moins');
      const plus = plat.querySelector('.plus');
      const quantiteInput = plat.querySelector('.quantite');

      if (!moins || !plus || !quantiteInput) return;

      // On supprime les anciens écouteurs pour éviter les doublons
      const nouveauMoins = moins.cloneNode(true);
      const nouveauPlus = plus.cloneNode(true);
      moins.replaceWith(nouveauMoins);
      plus.replaceWith(nouveauPlus);

      nouveauMoins.addEventListener('click', () => {
        let quantite = parseInt(quantiteInput.value, 10) || 1;
        if (quantite > 1) quantiteInput.value = quantite - 1;
      });

      nouveauPlus.addEventListener('click', () => {
        let quantite = parseInt(quantiteInput.value, 10) || 1;
        quantiteInput.value = quantite + 1;
      });
    });
  }

  function bindAjouterPanierButtons() {
    document.querySelectorAll('.plat').forEach(plat => {
      const bouton = plat.querySelector('.ajouter-panier');
      const nom = plat.querySelector('h3')?.textContent;
      const prixText = plat.querySelector('.prix-unite')?.textContent;
      const quantiteInput = plat.querySelector('.quantite');

      if (!bouton || !nom || !prixText || !quantiteInput) return;

      const prix = parseInt(prixText.match(/\d+/)[0], 10);

      bouton.addEventListener('click', () => {
        const quantite = parseInt(quantiteInput.value, 10);
        if (isNaN(quantite) || quantite < 1) return;

        const item = panier.find(p => p.nom === nom);
        if (item) {
          item.quantite += quantite;
        } else {
          panier.push({ nom, prix, quantite });
        }

        quantiteInput.value = 1;
        majPanier();
      });
    });
  }

  // Boutons
  document.getElementById('vider-panier')?.addEventListener('click', () => {
    panier = [];
    majPanier();
  });

  document.getElementById('ouvrir-modal')?.addEventListener('click', () => {
    if (panier.length === 0) {
      alert("Le panier est vide !");
      return;
    }
    document.getElementById('panier-modal')?.classList.remove('hidden');
  });

  document.getElementById('fermer-modal')?.addEventListener('click', () => {
    document.getElementById('panier-modal')?.classList.add('hidden');
  });

  document.getElementById('envoyer-commande')?.addEventListener('click', () => {
    const nom = document.getElementById('nom')?.value;
    const livraison = document.getElementById('livraison')?.value;
    const paiement = document.getElementById('paiement')?.value;
    const heure = document.getElementById('heure')?.value;

    if (!nom || !heure || !paiement || !livraison) {
      alert("Remplis tous les champs !");
      return;
    }

    const commandeText = panier.map(p => `${p.nom} x${p.quantite}`).join("\n");
    const total = panier.reduce((sum, p) => sum + p.prix * p.quantite, 0);

    let message =
      `Bonjour, je m'appelle ${nom}.\n\n` +
      ` Je souhaite commander :\n${commandeText}\n\n` +
      ` Total : ${total} FCFA\n` +
      ` Livraison : ${livraison}\n` +
      ` Paiement : ${paiement}\n` +
      ` Heure souhaitée : ${heure}h`;

    if (paiement === "Paiement mobile") {
      message += `\n\n📲 *Instructions de paiement mobile* :\n`;
      message += `➡️ Si tu utilises *Moov Money*, envoie à : *95 55 55 55*\n`;
      message += `➡️ Si tu utilises *Céltiis*, envoie à : *94 44 44 44*\n`;
      message += `📸 Merci d’envoyer une capture ici même sur WhatsApp après paiement.`;
    }

    const url = `https://wa.me/22961494563?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    document.getElementById('panier-modal')?.classList.add('hidden');
    document.querySelector('.panier-container')?.classList.add('hidden');
    panier = [];
    majPanier();
  });

  // Afficher les instructions si "Paiement mobile"
  const paiementSelect = document.getElementById('paiement');
  const instructionsDiv = document.getElementById('instructions-mobile');

  paiementSelect?.addEventListener('change', () => {
    instructionsDiv?.classList.toggle('hidden', paiementSelect.value !== 'Paiement mobile');
  });
function increase() {
    const span = document.getElementById("quantite");
    let current = parseInt(span.textContent);
    span.textContent = current + 1;
  }

  function decrease() {
    const span = document.getElementById("quantite");
    let current = parseInt(span.textContent);
    if (current > 1) {
      span.textContent = current - 1;
    }
  }
  // Initialisation
  bindQuantiteButtons();
  bindAjouterPanierButtons();
  majPanier();
});
