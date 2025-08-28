document.addEventListener('DOMContentLoaded', () => {
    const paletaContainer = document.getElementById('paleta-container');
    const gerarBtn = document.getElementById('gerar-btn');
    const paletasRelacionadasContainer = document.getElementById('paleta-relacionadas-container');
    // Modal
    const modal = document.getElementById('color-modal');
    const modalClose = document.getElementById('modal-close');
    const modalSelectedColor = document.getElementById('modal-selected-color');
    const modalSelectedHex = document.getElementById('modal-selected-hex');
    const modalDegradeContainer = document.getElementById('modal-degrade-container');

    // Função para gerar uma cor hexadecimal aleatória
    const gerarCorHex = () => {
        const letras = '0123456789ABCDEF';
        let cor = '#';
        for (let i = 0; i < 6; i++) {
            cor += letras[Math.floor(Math.random() * 16)];
        }
        return cor;
    };

    // Função para gerar degradê (variações de luminosidade da cor)
    function gerarDegrade(hex, quantidade = 5) {
        // Remove o #
        hex = hex.replace('#', '');
        // Converte para RGB
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);
        let cores = [];
        for (let i = 0; i < quantidade; i++) {
            // Calcula fator de luminosidade
            let fator = 0.2 + (i * 0.15);
            let nr = Math.round(r * fator + 255 * (1 - fator));
            let ng = Math.round(g * fator + 255 * (1 - fator));
            let nb = Math.round(b * fator + 255 * (1 - fator));
            let cor = `#${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`.toUpperCase();
            cores.push(cor);
        }
        return cores;
    }

    // Função para criar o card de cor na tela
    const criarCardCor = (cor) => {
        const corCard = document.createElement('div');
        corCard.classList.add('color-card');

        const corQuadrado = document.createElement('div');
        corQuadrado.classList.add('color-card__square');
        corQuadrado.style.backgroundColor = cor;

        const corHex = document.createElement('div');
        corHex.classList.add('color-card__hex');
        corHex.textContent = cor;

        corCard.appendChild(corQuadrado);
        corCard.appendChild(corHex);

        // Adiciona o evento de clique para copiar apenas no elemento de texto hexadecimal
        corHex.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o evento de clique do card seja disparado
            navigator.clipboard.writeText(cor)
                .then(() => {
                    alert(`Código copiado: ${cor}`);
                })
                .catch(err => {
                    console.error('Erro ao copiar: ', err);
                });
        });

        return corCard;
    };

    // Função para gerar a paleta aleatória completa
    const gerarPaletaAleatoria = () => {
        paletaContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const novaCor = gerarCorHex();
            const card = criarCardCor(novaCor);
            paletaContainer.appendChild(card);
        }
        // ...removido paletasSugeridasSection...
    };

    // Remove função de paletas sugeridas (não usada no modal)

    // Adiciona o evento de clique no botão de gerar paleta aleatória
    gerarBtn.addEventListener('click', () => {
        gerarPaletaAleatoria();
    });

    // Adiciona evento de clique para abrir modal ao clicar em um card de cor
    paletaContainer.addEventListener('click', (e) => {
        const corCard = e.target.closest('.color-card');
        if (corCard) {
            const cor = corCard.querySelector('.color-card__hex').textContent;
            abrirModalCor(cor);
        }
    });

    // Função para abrir o modal com a cor selecionada e degradê
    function abrirModalCor(cor) {
        modalSelectedColor.style.backgroundColor = cor;
        modalSelectedHex.textContent = cor;
        // Adiciona instrução no topo do modal
        modalSelectedHex.style.fontSize = '1.3rem';
        modalSelectedHex.style.marginBottom = '1.2rem';
        modalSelectedHex.innerHTML = `<span style="font-size:1.1rem;color:#555;font-weight:500;">Cor selecionada:</span><br>${cor}`;

        // Gera degradê
        const degradeCores = gerarDegrade(cor, 5);
        modalDegradeContainer.innerHTML = '';
        degradeCores.forEach(corDegrade => {
            // Cria card customizado para degradê
            const degradeCard = document.createElement('div');
            degradeCard.classList.add('degrade-card');

            const degradeColor = document.createElement('div');
            degradeColor.classList.add('degrade-card__color');
            degradeColor.style.backgroundColor = corDegrade;

            const degradeHex = document.createElement('div');
            degradeHex.classList.add('degrade-card__hex');
            degradeHex.textContent = corDegrade;
            degradeHex.title = 'Clique para copiar';

            // Ícone de copiar
            const copyIcon = document.createElement('span');
            copyIcon.classList.add('degrade-card__copy');
            copyIcon.innerHTML = '📋';
            copyIcon.title = 'Copiar cor';

            // Copiar ao clicar no código ou no ícone
            function copiarCor() {
                navigator.clipboard.writeText(corDegrade)
                    .then(() => {
                        copyIcon.classList.add('copied');
                        copyIcon.innerHTML = '✔';
                        setTimeout(() => {
                            copyIcon.classList.remove('copied');
                            copyIcon.innerHTML = '📋';
                        }, 1000);
                    });
            }
            degradeHex.addEventListener('click', copiarCor);
            copyIcon.addEventListener('click', copiarCor);

            degradeHex.appendChild(copyIcon);
            degradeCard.appendChild(degradeColor);
            degradeCard.appendChild(degradeHex);
            modalDegradeContainer.appendChild(degradeCard);
        });
        modal.classList.add('active');
    }

    // Evento para fechar o modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Fecha modal ao clicar fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Gera a paleta inicial ao carregar a página
    gerarPaletaAleatoria();
});