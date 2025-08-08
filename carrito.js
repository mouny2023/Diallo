// Fichier carrito.js - VERSION FINAL CORREGIDA
document.addEventListener('DOMContentLoaded', function () {
    let panier = [];

    function updateCartCount() {
        const totalCount = panier.reduce((sum, item) => sum + item.quantite, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalCount;
        }
    }

    function majPanier() {
        const liste = document.getElementById('panier-liste');
        const totalSpan = document.getElementById('panier-total');
        if (!liste || !totalSpan) return;

        liste.innerHTML = '';
        let somme = 0;
        panier.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nom} x${item.quantite} - ${item.prix * item.quantite} FCFA`;
            liste.appendChild(li);
            somme += item.prix * item.quantite;
        });

        totalSpan.textContent = somme;
        updateCartCount();
    }

    window.bindAllDynamicEvents = function(scope) {
        scope.querySelectorAll('.moins, .plus').forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.addEventListener('click', () => {
                const quantiteInput = newButton.parentElement.querySelector('.quantite');
                if (!quantiteInput) return;
                let quantite = parseInt(quantiteInput.value, 10);
                if (newButton.classList.contains('moins')) {
                    if (quantite > 1) quantiteInput.value = quantite - 1;
                } else {
                    quantiteInput.value = quantite + 1;
                }
            });
        });

        scope.querySelectorAll('.ajouter-panier').forEach(bouton => {
            const newBouton = bouton.cloneNode(true);
            bouton.parentNode.replaceChild(newBouton, bouton);
            newBouton.addEventListener('click', () => {
                const platContainer = newBouton.closest('.plat');
                if (!platContainer) return;
                
                const nom = platContainer.querySelector('h3')?.textContent;
                const quantiteInput = platContainer.querySelector('.quantite');
                // =================================================================
                // LÍNEA CORREGIDA: Usamos un selector simple para el precio
                // =================================================================
                const prixText = platContainer.querySelector('p')?.textContent;
                
                if (!nom || !quantiteInput || !prixText) {
                    console.error("No se encontraron todos los elementos necesarios para añadir al carrito.");
                    return;
                }
                
                const quantite = parseInt(quantiteInput.value, 10);
                const prixMatch = prixText.match(/\d+/);
                
                if (!prixMatch || isNaN(quantite) || quantite < 1) {
                     console.error("Datos de precio o cantidad inválidos.");
                    return;
                }
                
                const prix = parseInt(prixMatch[0], 10);
                const itemExistant = panier.find(p => p.nom === nom);
                
                if (itemExistant) {
                    itemExistant.quantite += quantite;
                } else {
                    panier.push({ nom, prix, quantite });
                }
                
                quantiteInput.value = 1;
                majPanier();
            });
        });
    }

    document.getElementById('vider-panier')?.addEventListener('click', () => {
        panier = [];
        majPanier();
        const totalSpan = document.getElementById('panier-total');
        if (totalSpan) {
            totalSpan.textContent = '0';
        }
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
            alert("Remplissez tous les champs !");
            return;
        }
        const commandeText = panier.map(p => `${p.nom} x${p.quantite}`).join("\n");
        const total = panier.reduce((sum, p) => sum + p.prix * p.quantite, 0);
        let message = `Bonjour, je m'appelle ${nom}.\n\nJe souhaite commander :\n${commandeText}\n\nTotal : ${total} FCFA\nLivraison : ${livraison}\nPaiement : ${paiement}\nHeure souhaitée : ${heure}h`;
        if (paiement === "Paiement mobile") {
            message += `\n\n📲 *Instructions de paiement mobile* :\n➡️ Si tu utilises *Moov Money*, envoie à : *95 55 55 55*\n➡️ Si tu utilises *Céltiis*, envoie à : *94 44 44 44*\n📸 Merci d’envoyer une capture ici même sur WhatsApp après paiement.`;
        }
        const url = `https://wa.me/22966159626?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        document.getElementById('panier-modal')?.classList.add('hidden');
        panier = [];
        majPanier();
    });
    
    const paiementSelect = document.getElementById('paiement');
    const instructionsDiv = document.getElementById('instructions-mobile');
    paiementSelect?.addEventListener('change', () => {
        instructionsDiv?.classList.toggle('hidden', paiementSelect.value !== 'Paiement mobile');
    });

    window.bindAllDynamicEvents(document.body);
    majPanier();
});