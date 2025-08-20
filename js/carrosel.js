function moverCarrossel(direcao) {
      const carrossel = document.getElementById("carrossel");
      const scrollAmount = 250; // tamanho do pulo
      carrossel.scrollBy({ left: direcao * scrollAmount, behavior: "smooth" });
    }