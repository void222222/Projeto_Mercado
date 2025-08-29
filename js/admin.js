 // Dados de exemplo
        const adminUser = {
            username: "admin",
            password: "admin123"
        };

        // Simulação de banco de dados
        let carouselItems = JSON.parse(localStorage.getItem('carouselItems')) || [];
        let products = JSON.parse(localStorage.getItem('products')) || [];

        // Elementos DOM
        const loginPage = document.getElementById('loginPage');
        const adminPanel = document.getElementById('adminPanel');
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        const addCarouselForm = document.getElementById('addCarouselForm');
        const carouselImage = document.getElementById('carouselImage');
        const carouselPreview = document.getElementById('carouselPreview');
        const carouselItemsContainer = document.getElementById('carouselItems');
        const addProductForm = document.getElementById('addProductForm');
        const productImage = document.getElementById('productImage');
        const productPreview = document.getElementById('productPreview');
        const productsList = document.getElementById('productsList');
        const tabLinks = document.querySelectorAll('.sidebar-menu a');
        const tabContents = document.querySelectorAll('.tab-content');
        const carouselCount = document.getElementById('carouselCount');
        const productsCount = document.getElementById('productsCount');
        const currentDateEl = document.getElementById('currentDate');

        // Data atual
        function updateCurrentDate() {
            const now = new Date();
            currentDateEl.textContent = now.toLocaleDateString('pt-BR');
        }

        // Preview da imagem do carrossel
        carouselImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    carouselPreview.src = event.target.result;
                    carouselPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Preview da imagem do produto
        productImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    productPreview.src = event.target.result;
                    productPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Login
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === adminUser.username && password === adminUser.password) {
                loginPage.style.display = 'none';
                adminPanel.style.display = 'flex';
                renderCarouselItems();
                renderProducts();
                updateCurrentDate();
                showAlert('Login realizado com sucesso!', 'success');
            } else {
                showAlert('Usuário ou senha incorretos! Use: admin / admin123', 'error');
            }
        });

        // Logout
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginPage.style.display = 'flex';
            adminPanel.style.display = 'none';
            loginForm.reset();
        });

        // Navegação entre abas
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.id !== 'logoutBtn') {
                    // Remover classe active de todos os links
                    tabLinks.forEach(l => l.classList.remove('active'));
                    // Adicionar classe active ao link clicado
                    this.classList.add('active');
                    
                    // Esconder todos os conteúdos de abas
                    tabContents.forEach(content => content.style.display = 'none');
                    
                    // Mostrar o conteúdo da aba correspondente
                    const tabId = this.getAttribute('data-tab') + 'Tab';
                    document.getElementById(tabId).style.display = 'block';
                }
            });
        });

        // Adicionar item ao carrossel
        addCarouselForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('carouselTitle').value;
            const description = document.getElementById('carouselDescription').value;
            const link = document.getElementById('carouselLink').value;
            const category = document.getElementById('carouselCategory').value;
            const status = document.getElementById('carouselStatus').value;
            
            if (category) {
                const newItem = {
                    id: Date.now(),
                    title: title,
                    description: description,
                    link: link,
                    category: category,
                    status: status,
                    date: new Date().toISOString()
                };
                
                carouselItems.push(newItem);
                
                try {
                    localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
                    renderCarouselItems();
                    addCarouselForm.reset();
                    carouselPreview.style.display = 'none';
                    showAlert('Item adicionado ao carrossel com sucesso!', 'success');
                } catch (e) {
                    showAlert('Erro ao salvar: espaço de armazenamento insuficiente.', 'error');
                    carouselItems.pop();
                }
            } else {
                showAlert('Por favor, selecione uma categoria para o item.', 'error');
            }
        });

        // Adicionar produto
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('productTitle').value;
            const description = document.getElementById('productDescription').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const category = document.getElementById('productCategory').value;
            const status = document.getElementById('productStatus').value;
            
            // Verificar se estamos editando
            const isEditing = addProductForm.getAttribute('data-editing');
            
            if (title && description && price && category) {
                const productData = {
                    id: isEditing ? parseInt(isEditing) : Date.now(),
                    title: title,
                    description: description,
                    price: price,
                    category: category,
                    status: status,
                    date: isEditing ? products.find(p => p.id === parseInt(isEditing)).date : new Date().toISOString()
                };
                
                if (isEditing) {
                    // Atualizar produto existente
                    const index = products.findIndex(p => p.id === parseInt(isEditing));
                    if (index !== -1) {
                        products[index] = productData;
                    }
                } else {
                    // Adicionar novo produto
                    products.push(productData);
                }
                
                try {
                    localStorage.setItem('products', JSON.stringify(products));
                    renderProducts();
                    addProductForm.reset();
                    addProductForm.removeAttribute('data-editing');
                    productPreview.style.display = 'none';
                    
                    // Restaurar texto do botão
                    const submitButton = addProductForm.querySelector('button[type="submit"]');
                    submitButton.innerHTML = '<i class="fas fa-plus"></i> Adicionar Produto';
                    
                    showAlert(isEditing ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!', 'success');
                } catch (e) {
                    showAlert('Erro ao salvar: espaço de armazenamento insuficiente.', 'error');
                    if (!isEditing) products.pop();
                }
            } else {
                showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        });

        // Renderizar itens do carrossel
        function renderCarouselItems() {
            if (carouselItems.length === 0) {
                carouselItemsContainer.innerHTML = '<p>Nenhuma imagem adicionada ao carrossel.</p>';
                carouselCount.textContent = '0';
                return;
            }
            
            carouselItemsContainer.innerHTML = '';
            
            carouselItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'list-item';
                itemElement.innerHTML = `
                    <img src="https://via.placeholder.com/100x80?text=Carrossel" alt="${item.title || 'Imagem do carrossel'}">
                    <div class="list-item-details">
                        <h4>${item.title || 'Sem título'}</h4>
                        ${item.description ? `<p>${item.description}</p>` : ''}
                        ${item.link ? `<p><small>Link: <a href="${item.link}" target="_blank">${item.link}</a></small></p>` : ''}
                        <p><small>Categoria: <span class="category-badge">${getCategoryDisplayName(item.category)}</span></small></p>
                        <p><small>Adicionado em: ${new Date(item.date).toLocaleDateString('pt-BR')}</small></p>
                        <p><span class="status-indicator status-${item.status}"></span> ${item.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn btn-danger" onclick="deleteCarouselItem(${item.id})">
                            <i class="fas fa-trash-alt"></i> Excluir
                        </button>
                    </div>
                `;
                carouselItemsContainer.appendChild(itemElement);
            });
            
            const activeItems = carouselItems.filter(item => item.status === 'active').length;
            carouselCount.textContent = activeItems;
        }

        // Renderizar produtos
        function renderProducts() {
            if (products.length === 0) {
                productsList.innerHTML = '<p>Nenhum produto cadastrado.</p>';
                productsCount.textContent = '0';
                return;
            }
            
            productsList.innerHTML = '';
            
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'list-item';
                productElement.innerHTML = `
                    <img src="https://via.placeholder.com/100x80?text=Produto" alt="${product.title}">
                    <div class="list-item-details">
                        <h4>${product.title}</h4>
                        <p>${product.description}</p>
                        <p class="product-price">Preço: R$ ${product.price.toFixed(2)}</p>
                        <p><small>Categoria: <span class="category-badge">${getCategoryDisplayName(product.category)}</span></small></p>
                        <p><small>Adicionado em: ${new Date(product.date).toLocaleDateString('pt-BR')}</small></p>
                        <p><span class="status-indicator status-${product.status}"></span> ${product.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash-alt"></i> Excluir
                        </button>
                    </div>
                `;
                productsList.appendChild(productElement);
            });
            
            productsCount.textContent = products.length;
        }

        // Obter nome amigável para exibição da categoria
        function getCategoryDisplayName(category) {
            const categoryNames = {
                'homepage': 'Página Inicial',
                'produtos': 'Página de Produtos',
                'promocoes': 'Página de Promoções',
                'fraldas': 'Fraldas',
                'higiene': 'Higiene',
                'alimentos': 'Alimentos',
                'limpeza': 'Limpeza'
            };
            return categoryNames[category] || category;
        }

        // Excluir item do carrossel
        function deleteCarouselItem(id) {
            if (confirm('Tem certeza que deseja excluir este item do carrossel?')) {
                carouselItems = carouselItems.filter(item => item.id !== id);
                try {
                    localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
                    renderCarouselItems();
                    showAlert('Item excluído com sucesso!', 'success');
                } catch (e) {
                    showAlert('Erro ao salvar alterações.', 'error');
                }
            }
        }

        // Excluir produto
        function deleteProduct(id) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                products = products.filter(product => product.id !== id);
                try {
                    localStorage.setItem('products', JSON.stringify(products));
                    renderProducts();
                    showAlert('Produto excluído com sucesso!', 'success');
                } catch (e) {
                    showAlert('Erro ao salvar alterações.', 'error');
                }
            }
        }

        // Editar produto
        function editProduct(id) {
            const product = products.find(product => product.id === id);
            if (product) {
                // Preencher o formulário com os dados do produto
                document.getElementById('productTitle').value = product.title;
                document.getElementById('productDescription').value = product.description;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productStatus').value = product.status;
                
                // Mostrar imagem de placeholder
                productPreview.src = 'https://via.placeholder.com/200x150?text=Imagem+do+Produto';
                productPreview.style.display = 'block';
                
                // Configurar o formulário para modo de edição
                document.getElementById('addProductForm').setAttribute('data-editing', id);
                
                // Alterar o texto do botão para "Atualizar"
                const submitButton = addProductForm.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<i class="fas fa-save"></i> Atualizar Produto';
                
                // Rolar para o formulário
                document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth' });
                
                showAlert('Preencha o formulário para editar o produto.', 'success');
            }
        }

        // Mostrar alertas
        function showAlert(message, type = 'success') {
            // Remover alertas existentes
            const existingAlerts = document.querySelectorAll('.alert');
            existingAlerts.forEach(alert => alert.remove());
            
            // Criar novo alerta
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                ${message}
            `;
            
            // Adicionar alerta ao topo do conteúdo principal
            const mainContent = document.querySelector('.main-content');
            mainContent.insertBefore(alert, mainContent.firstChild);
            
            // Remover alerta após 5 segundos
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 5000);
        }

        // Inicializar preview de imagens
        carouselPreview.style.display = 'none';
        productPreview.style.display = 'none';
        
        // Inicializar data atual
        updateCurrentDate();
        
        // Limpar localStorage se estiver cheio (para demo)
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            console.warn('LocalStorage está cheio. Limpando dados...');
            localStorage.clear();
            carouselItems = [];
            products = [];
        }