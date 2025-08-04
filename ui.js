document.addEventListener('DOMContentLoaded', function () {

  const retourHaut = document.getElementById('retour-haut');

  // On vérifie que le bouton existe avant de continuer
  if (retourHaut) {
    window.addEventListener('scroll', () => {
      // Si on a fait défiler de plus de 300 pixels vers le bas
      if (window.pageYOffset > 300) {
        retourHaut.classList.add('visible');
      } else {
        retourHaut.classList.remove('visible');
      }
    });
  }

});