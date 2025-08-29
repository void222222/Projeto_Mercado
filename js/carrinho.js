  document.addEventListener('DOMContentLoaded', function() {
            const carrinhoItens = document.getElementById('carrinho-itens');
            const resumoSubtotal = document.getElementById('resumo-subtotal');
            const resumoFrete = document.getElementById('resumo-frete');
            const resumoTotal = document.getElementById('resumo-total');
            const btnFinalizar = document.getElementById('btn-finalizar');
            const cartCounter = document.getElementById('cartCounter');
            
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            
            // Renderizar carrinho
            renderizarCarrinho();
            
            // Event listener para finalizar compra
            btnFinalizar.addEventListener('click', function() {
                if (carrinho.length > 0) {
                    alert('Compra finalizada com sucesso! Obrigado pela preferência.');
                    localStorage.removeItem('carrinho');
                    carrinho = [];
                    renderizarCarrinho();
                } else {
                    alert('Seu carrinho está vazio!');
                }
            });
            
            function renderizarCarrinho() {
                // Limpar carrinho
                carrinhoItens.innerHTML = '';
                
                // Atualizar contador
                const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
                cartCounter.textContent = totalItens;
                
                if (carrinho.length === 0) {
                    carrinhoItens.innerHTML = `
                        <div class="carrinho-vazio">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Seu carrinho está vazio</p>
                            <a href="#">Continuar comprando</a>
                        </div>
                    `;
                    atualizarResumo(0);
                    return;
                }
                
                // Calcular subtotal
                let subtotal = 0;
                
                // Adicionar itens ao carrinho
                carrinho.forEach((item, index) => {
                    const itemTotal = item.price * item.quantidade;
                    subtotal += itemTotal;
                    
                    const itemElement = document.createElement('div');
                    itemElement.className = 'carrinho-item';
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.title}">
                        <div class="carrinho-item-info">
                            <h3>${item.title}</h3>
                            <div class="carrinho-item-preco">R$ ${item.price.toFixed(2)}</div>
                            <div class="carrinho-item-quantidade">
                                <button onclick="alterarQuantidade(${index}, -1)">-</button>
                                <input type="number" value="${item.quantidade}" min="1" onchange="alterarQuantidadeInput(${index}, this.value)">
                                <button onclick="alterarQuantidade(${index}, 1)">+</button>
                            </div>
                        </div>
                        <div class="carrinho-item-total">
                            R$ ${itemTotal.toFixed(2)}
                        </div>
                        <button class="carrinho-item-remover" onclick="removerItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    
                    carrinhoItens.appendChild(itemElement);
                });
                
                atualizarResumo(subtotal);
            }
            
            function atualizarResumo(subtotal) {
                const frete = subtotal > 0 ? 15.00 : 0; // Frete fixo de R$ 15,00
                const total = subtotal + frete;
                
                resumoSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
                resumoFrete.textContent = `R$ ${frete.toFixed(2)}`;
                resumoTotal.textContent = `R$ ${total.toFixed(2)}`;
            }
            
            window.alterarQuantidade = function(index, alteracao) {
                carrinho[index].quantidade += alteracao;
                
                if (carrinho[index].quantidade < 1) {
                    carrinho[index].quantidade = 1;
                }
                
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
            }
            
            window.alterarQuantidadeInput = function(index, valor) {
                const quantidade = parseInt(valor) || 1;
                
                if (quantidade < 1) {
                    carrinho[index].quantidade = 1;
                } else {
                    carrinho[index].quantidade = quantidade;
                }
                
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
            }
            
            window.removerItem = function(index) {
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
            }
        });