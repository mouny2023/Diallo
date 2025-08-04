document.addEventListener('DOMContentLoaded', function () {

  const swiper = new Swiper('.swiper', {
    // Rend le carrousel infini (il boucle)
    loop: true, 
    
    // Active les flèches de navigation
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Active la pagination (les points en bas)
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // Fait défiler automatiquement les images toutes les 4 secondes
    autoplay: {
        delay: 4000,
        disableOnInteraction: false, // Continue même si l'utilisateur interagit
    },
  });

});