 // Variável para controlar a posição do carrossel
        let currentScrollPosition = 0;

        // Inicializar a página
        document.addEventListener('DOMContentLoaded', function() {
            carregarProdutos();
            atualizarContadorCarrinho();
        });

        // Função para carregar produtos da API
        async function carregarProdutos() {
            try {
                const response = await fetch('http://localhost:3000/api/products');
                const produtos = await response.json();
                
                // Filtrar apenas produtos ativos
                const produtosAtivos = produtos.filter(produto => produto.status === 'active');
                renderizarProdutos(produtosAtivos);
                
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
                // Fallback para produtos locais em caso de erro
                const produtosLocais = obterProdutosLocais();
                renderizarProdutos(produtosLocais);
            }
        }

        // Fallback para produtos locais
        function obterProdutosLocais() {
            return [
                {
                    id: 1,
                    image: "https://via.placeholder.com/200x200/3498db/ffffff?text=Fralda+Pampers",
                    title: "Fralda Pampers Confort Sec XXG 60 Unidades",
                    description: "Fraldas descartáveis de alta absorção",
                    price: 89.90,
                    status: "active"
                },
                {
                    id: 2,
                    image: "https://via.placeholder.com/200x200/e74c3c/ffffff?text=Fralda+Monica",
                    title: "Fralda Turma da Mônica Baby XXG 36 Unidades",
                    description: "Fraldas com estampa da Turma da Mônica",
                    price: 39.90,
                    status: "active"
                },
                {
                    id: 3,
                    image: "https://via.placeholder.com/200x200/2ecc71/ffffff?text=Alcatra",
                    title: "Alcatra Bovina 500g",
                    description: "Carne bovina de primeira qualidade",
                    price: 29.90,
                    status: "active"
                },
                {
                    id: 4,
                    image: "https://via.placeholder.com/200x200/9b59b6/ffffff?text=Amaciante",
                    title: "Amaciante Comfort Concentrado Original 500ml",
                    description: "Amaciante de roupas com fragrância suave",
                    price: 12.90,
                    status: "active"
                },
                {
                    id: 5,
                    image: "https://via.placeholder.com/200x200/f39c12/ffffff?text=Café",
                    title: "Café Premium 500g",
                    description: "Café torrado e moído de alta qualidade",
                    price: 15.90,
                    status: "active"
                },
                {
                    id: 6,
                    image: "https://via.placeholder.com/200x200/16a085/ffffff?text=Arroz",
                    title: "Arroz Integral 1kg",
                    description: "Arroz integral orgânico",
                    price: 8.90,
                    status: "active"
                }
            ];
        }

        // Função para renderizar os produtos
        function renderizarProdutos(produtos) {
            const carouselElement = document.getElementById('carrossel');
            
            if (produtos.length === 0) {
                carouselElement.innerHTML = `
                    <div class="no-products">
                        <i class="fas fa-box-open" style="font-size: 48px; color: #ddd; margin-bottom: 15px;"></i>
                        <h3>Nenhum produto disponível</h3>
                        <p>Volte em breve para conferir nossas novidades!</p>
                    </div>
                `;
                document.querySelector('.btn-prev').style.display = 'none';
                document.querySelector('.btn-next').style.display = 'none';
                return;
            }
            
            carouselElement.innerHTML = '';
            
            produtos.forEach(produto => {
                const productDiv = document.createElement('div');
                productDiv.className = 'produto';
                
                productDiv.innerHTML = `
                    <img src="${produto.image || 'https://via.placeholder.com/200x200?text=Produto'}" 
                         alt="${produto.title}" 
                         onerror="this.src='https://via.placeholder.com/200x200?text=Erro+Imagem'">
                    <h3>${produto.title}</h3>
                    <p>${produto.description}</p>
                    <div class="produto-preco">R$ ${produto.price.toFixed(2)}</div>
                    <button class="btn-add-cart" onclick="adicionarAoCarrinho(${produto.id})">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                `;
                
                carouselElement.appendChild(productDiv);
            });
            
            // Mostrar os botões de navegação apenas se houver produtos suficientes
            if (produtos.length <= 4) {
                document.querySelector('.btn-prev').style.display = 'none';
                document.querySelector('.btn-next').style.display = 'none';
            } else {
                document.querySelector('.btn-prev').style.display = 'block';
                document.querySelector('.btn-next').style.display = 'block';
            }
        }

        // Função para mover o carrossel
        function moverCarrossel(direction) {
            const carousel = document.getElementById('carrossel');
            const produtos = document.querySelectorAll('.produto');
            
            if (produtos.length <= 4) return;
            
            const productWidth = produtos[0].offsetWidth + 30;
            const visibleProducts = Math.floor(carousel.offsetWidth / productWidth);
            const totalProducts = produtos.length;
            
            currentScrollPosition += direction * visibleProducts * productWidth;
            
            const maxScroll = (totalProducts - visibleProducts) * productWidth;
            currentScrollPosition = Math.max(0, Math.min(currentScrollPosition, maxScroll));
            
            carousel.style.transform = `translateX(-${currentScrollPosition}px)`;
        }

        // Função para adicionar produto ao carrinho
        async function adicionarAoCarrinho(id) {
            try {
                // Buscar informações completas do produto da API
                const response = await fetch('http://localhost:3000/api/products');
                const produtos = await response.json();
                const produto = produtos.find(p => p.id === id);
                
                if (!produto) {
                    alert('Produto não encontrado!');
                    return;
                }
                
                // Obter carrinho atual do localStorage
                let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                
                // Verificar se o produto já está no carrinho
                const itemExistente = carrinho.find(item => item.id === id);
                
                if (itemExistente) {
                    itemExistente.quantidade += 1;
                } else {
                    carrinho.push({
                        id: produto.id,
                        title: produto.title,
                        price: produto.price,
                        image: produto.image,
                        quantidade: 1
                    });
                }
                
                // Salvar carrinho atualizado
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                
                // Mostrar notificação
                mostrarNotificacao();
                
                // Atualizar contador do carrinho
                atualizarContadorCarrinho();
                
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
                // Fallback: tentar usar produtos locais
                const produtosLocais = obterProdutosLocais();
                const produto = produtosLocais.find(p => p.id === id);
                
                if (produto) {
                    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                    const itemExistente = carrinho.find(item => item.id === id);
                    
                    if (itemExistente) {
                        itemExistente.quantidade += 1;
                    } else {
                        carrinho.push({
                            id: produto.id,
                            title: produto.title,
                            price: produto.price,
                            image: produto.image,
                            quantidade: 1
                        });
                    }
                    
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    mostrarNotificacao();
                    atualizarContadorCarrinho();
                } else {
                    alert('Erro ao adicionar produto ao carrinho');
                }
            }
        }

        // Função para mostrar notificação
        function mostrarNotificacao() {
            const notification = document.getElementById('cartNotification');
            if (notification) {
                notification.style.display = 'block';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            }
        }

        // Função para atualizar contador do carrinho
        function atualizarContadorCarrinho() {
            const cartCounter = document.getElementById('cartCounter');
            if (cartCounter) {
                const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
                cartCounter.textContent = totalItens;
            }
        }