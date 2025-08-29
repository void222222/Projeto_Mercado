// Variável para controlar a posição do carrossel
        let currentScrollPosition = 0;

        // Inicializar a página
        document.addEventListener('DOMContentLoaded', function() {
            renderizarProdutos();
            atualizarContadorCarrinho();
        });

        // Função para obter produtos do localStorage
        function obterProdutos() {
            try {
                const produtosSalvos = JSON.parse(localStorage.getItem('products')) || [];
                
                // Se não houver produtos salvos, usar os produtos de exemplo
                if (produtosSalvos.length === 0) {
                    return [
                        {
                            id: 1,
                            image: "https://via.placeholder.com/200x200/3498db/ffffff?text=Fralda+Pampers",
                            title: "Fralda Pampers Confort Sec XXG 60 Unidades",
                            description: "Fraldas descartáveis de alta absorção",
                            price: 89.90
                        },
                        {
                            id: 2,
                            image: "https://via.placeholder.com/200x200/e74c3c/ffffff?text=Fralda+Monica",
                            title: "Fralda Turma da Mônica Baby XXG 36 Unidades",
                            description: "Fraldas com estampa da Turma da Mônica",
                            price: 39.90
                        },
                        {
                            id: 3,
                            image: "https://via.placeholder.com/200x200/2ecc71/ffffff?text=Alcatra",
                            title: "Alcatra Bovina 500g",
                            description: "Carne bovina de primeira qualidade",
                            price: 29.90
                        },
                        {
                            id: 4,
                            image: "https://via.placeholder.com/200x200/9b59b6/ffffff?text=Amaciante",
                            title: "Amaciante Comfort Concentrado Original 500ml",
                            description: "Amaciante de roupas com fragrância suave",
                            price: 12.90
                        }
                    ];
                }
                
                // Converter produtos do formato do admin para o formato da loja
                return produtosSalvos.map(produto => ({
                    id: produto.id,
                    title: produto.title,
                    description: produto.description,
                    price: produto.price,
                    image: "https://via.placeholder.com/200x200/3498db/ffffff?text=" + encodeURIComponent(produto.title.substring(0, 15)),
                    status: produto.status
                })).filter(produto => produto.status === 'active'); // Mostrar apenas produtos ativos
                
            } catch (e) {
                console.error('Erro ao carregar produtos:', e);
                return [];
            }
        }

        // Função para renderizar os produtos no carrossel
        function renderizarProdutos() {
            const carouselElement = document.getElementById('carrossel');
            const produtos = obterProdutos();
            
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
                    <img src="${produto.image}" alt="${produto.title}">
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
            const produtos = obterProdutos();
            
            if (produtos.length <= 4) return;
            
            const productWidth = document.querySelector('.produto').offsetWidth + 30;
            const visibleProducts = Math.floor(carousel.offsetWidth / productWidth);
            const totalProducts = document.querySelectorAll('.produto').length;
            
            currentScrollPosition += direction * visibleProducts * productWidth;
            
            const maxScroll = (totalProducts - visibleProducts) * productWidth;
            currentScrollPosition = Math.max(0, Math.min(currentScrollPosition, maxScroll));
            
            carousel.style.transform = `translateX(-${currentScrollPosition}px)`;
        }

        // Função para adicionar produto ao carrinho
        function adicionarAoCarrinho(id) {
            const produtos = obterProdutos();
            const produto = produtos.find(p => p.id === id);
            
            if (!produto) return;
            
            // Obter carrinho atual do localStorage
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            
            // Verificar se o produto já está no carrinho
            const itemExistente = carrinho.find(item => item.id === id);
            
            if (itemExistente) {
                // Se já existe, aumentar a quantidade
                itemExistente.quantidade += 1;
            } else {
                // Se não existe, adicionar novo produto
                carrinho.push({
                    id: produto.id,
                    title: produto.title,
                    price: produto.price,
                    image: produto.image,
                    quantidade: 1
                });
            }
            
            // Salvar carrinho atualizado no localStorage
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            
            // Mostrar notificação
            mostrarNotificacao();
            
            // Atualizar contador do carrinho
            atualizarContadorCarrinho();
        }

        // Função para mostrar notificação
        function mostrarNotificacao() {
            const notification = document.getElementById('cartNotification');
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        // Função para atualizar contador do carrinho
        function atualizarContadorCarrinho() {
            const cartCounter = document.getElementById('cartCounter');
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            
            // Calcular o total de itens no carrinho
            const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
            
            cartCounter.textContent = totalItens;
        }