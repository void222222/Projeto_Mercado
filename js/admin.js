  // Dados de exemplo
        const adminUser = {
            username: "admin",
            password: "admin123"
        };

        // Elementos DOM
        const loginPage = document.getElementById('loginPage');
        const adminPanel = document.getElementById('adminPanel');
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        const addCarouselForm = document.getElementById('addCarouselForm');
        const carouselImage = document.getElementById('carouselImage');
        const carouselPreview = document.getElementById('carouselPreview');
        const carouselPreviewText = document.getElementById('carouselPreviewText');
        const carouselItemsContainer = document.getElementById('carouselItems');
        const addProductForm = document.getElementById('addProductForm');
        const productImage = document.getElementById('productImage');
        const productPreview = document.getElementById('productPreview');
        const productPreviewText = document.getElementById('productPreviewText');
        const productsList = document.getElementById('productsList');
        const tabLinks = document.querySelectorAll('.sidebar-menu a');
        const tabContents = document.querySelectorAll('.tab-content');
        const carouselCount = document.getElementById('carouselCount');
        const productsCount = document.getElementById('productsCount');
        const currentDateEl = document.getElementById('currentDate');
        const alertContainer = document.getElementById('alertContainer');

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
                    carouselPreviewText.style.display = 'none';
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
                    productPreviewText.style.display = 'none';
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
                loadCarouselItems();
                loadProducts();
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
                    tabLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    tabContents.forEach(content => content.style.display = 'none');
                    
                    const tabId = this.getAttribute('data-tab') + 'Tab';
                    document.getElementById(tabId).style.display = 'block';
                }
            });
        });

        // Função para fazer requisições com tratamento de erro
        async function makeRequest(url, options = {}) {
            try {
                const response = await fetch(url, options);
                
                // Verificar se a resposta é JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Resposta não é JSON: ${text.substring(0, 100)}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('Erro na requisição:', error);
                throw error;
            }
        }

        // Carregar itens do carrossel do servidor
        async function loadCarouselItems() {
            try {
                const carouselItems = await makeRequest('http://localhost:3000/api/carousel');
                renderCarouselItems(carouselItems);
            } catch (error) {
                console.error('Erro ao carregar carrossel:', error);
                showAlert('Erro ao carregar itens do carrossel. Verifique se o servidor está rodando.', 'error');
                // Dados de exemplo para demonstração
                renderCarouselItems([
                    {
                        id: 1,
                        title: "Oferta Especial",
                        description: "Promoção de verão com descontos incríveis",
                        image: "https://via.placeholder.com/300x200?text=Imagem+Carrossel",
                        category: "homepage",
                        status: "active",
                        date: new Date().toISOString()
                    }
                ]);
            }
        }

        // Carregar produtos do servidor
        async function loadProducts() {
            try {
                const products = await makeRequest('http://localhost:3000/api/products');
                renderProducts(products);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
                showAlert('Erro ao carregar produtos. Verifique se o servidor está rodando.', 'error');
                // Dados de exemplo para demonstração
                renderProducts([
                    {
                        id: 1,
                        title: "Produto Exemplo",
                        description: "Descrição do produto exemplo",
                        price: 29.99,
                        image: "https://via.placeholder.com/200x150?text=Produto",
                        category: "alimentos",
                        status: "active",
                        date: new Date().toISOString()
                    }
                ]);
            }
        }

        // Adicionar item ao carrossel
        addCarouselForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const title = document.getElementById('carouselTitle').value;
            const description = document.getElementById('carouselDescription').value;
            const link = document.getElementById('carouselLink').value;
            const category = document.getElementById('carouselCategory').value;
            const status = document.getElementById('carouselStatus').value;
            
            if (category) {
                try {
                    const response = await fetch('http://localhost:3000/api/carousel', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title,
                            description,
                            link,
                            category,
                            status,
                            image: carouselPreview.src || 'https://via.placeholder.com/300x200?text=Imagem'
                        })
                    });
                    
                    // Verificar se a resposta é JSON
                    const contentType = response.headers.get('content-type');
                    let result;
                    
                    if (contentType && contentType.includes('application/json')) {
                        result = await response.json();
                    } else {
                        const text = await response.text();
                        throw new Error(`Resposta não é JSON: ${text.substring(0, 100)}`);
                    }
                    
                    if (result.success) {
                        showAlert('Item adicionado ao carrossel com sucesso!', 'success');
                        addCarouselForm.reset();
                        carouselPreview.style.display = 'none';
                        carouselPreviewText.style.display = 'block';
                        loadCarouselItems();
                    } else {
                        showAlert('Erro ao adicionar item: ' + result.error, 'error');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    showAlert('Erro de conexão. Verifique se o servidor está rodando na porta 3000.', 'error');
                }
            } else {
                showAlert('Por favor, selecione uma categoria para o item.', 'error');
            }
        });

        // Adicionar produto
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const title = document.getElementById('productTitle').value;
            const description = document.getElementById('productDescription').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const category = document.getElementById('productCategory').value;
            const status = document.getElementById('productStatus').value;
            
            if (title && description && price && category) {
                try {
                    const response = await fetch('http://localhost:3000/api/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title,
                            description,
                            price,
                            category,
                            status,
                            image: productPreview.src || 'https://via.placeholder.com/200x150?text=Produto'
                        })
                    });
                    
                    // Verificar se a resposta é JSON
                    const contentType = response.headers.get('content-type');
                    let result;
                    
                    if (contentType && contentType.includes('application/json')) {
                        result = await response.json();
                    } else {
                        const text = await response.text();
                        throw new Error(`Resposta não é JSON: ${text.substring(0, 100)}`);
                    }
                    
                    if (result.success) {
                        showAlert('Produto adicionado com sucesso!', 'success');
                        addProductForm.reset();
                        productPreview.style.display = 'none';
                        productPreviewText.style.display = 'block';
                        loadProducts();
                    } else {
                        showAlert('Erro ao adicionar produto: ' + result.error, 'error');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    showAlert('Erro de conexão. Verifique se o servidor está rodando na porta 3000.', 'error');
                }
            } else {
                showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        });

        // Renderizar itens do carrossel
        function renderCarouselItems(carouselItems) {
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
                    <img src="${item.image}" alt="${item.title || 'Imagem do carrossel'}" 
                         onerror="this.src='https://via.placeholder.com/100x80?text=Erro+Imagem'">
                    <div class="list-item-details">
                        <h4>${item.title || 'Sem título'}</h4>
                        ${item.description ? `<p>${item.description}</p>` : ''}
                        ${item.link ? `<p><small>Link: <a href="${item.link}" target="_blank">${item.link}</a></small></p>` : ''}
                        <p><small>Categoria: <span class="category-badge">${getCategoryDisplayName(item.category)}</span></small></p>
                        <p><small>Adicionado em: ${new Date(item.date).toLocaleDateString('pt-BR')}</small></p>
                        <p><span class="status-indicator status-${item.status}"></span> ${item.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteCarouselItem(${item.id})">
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
        function renderProducts(products) {
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
                    <img src="${product.image}" alt="${product.title}" 
                         onerror="this.src='https://via.placeholder.com/100x80?text=Erro+Imagem'">
                    <div class="list-item-details">
                        <h4>${product.title}</h4>
                        <p>${product.description}</p>
                        <p class="product-price">Preço: R$ ${product.price.toFixed(2)}</p>
                        <p><small>Categoria: <span class="category-badge">${getCategoryDisplayName(product.category)}</span></small></p>
                        <p><small>Adicionado em: ${new Date(product.date).toLocaleDateString('pt-BR')}</small></p>
                        <p><span class="status-indicator status-${product.status}"></span> ${product.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn btn-sm" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash-alt"></i> Excluir
                        </button>
                    </div>
                `;
                productsList.appendChild(productElement);
            });
            
            productsCount.textContent = products.length;
        }

        // Funções auxiliares
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

        async function deleteCarouselItem(id) {
            if (confirm('Tem certeza que deseja excluir este item do carrossel?')) {
                showAlert('Funcionalidade de exclusão será implementada em breve', 'info');
            }
        }

        async function deleteProduct(id) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                showAlert('Funcionalidade de exclusão será implementada em breve', 'info');
            }
        }

        function editProduct(id) {
            showAlert('Funcionalidade de edição será implementada em breve', 'info');
        }

        function showAlert(message, type = 'success') {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                ${message}
            `;
            
            alertContainer.appendChild(alert);
            
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 5000);
        }

        // Inicializar
        carouselPreview.style.display = 'none';
        productPreview.style.display = 'none';
        updateCurrentDate();