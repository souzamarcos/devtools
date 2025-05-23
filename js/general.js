// Gerenciamento de idiomas
let currentLang = 'pt';
const defaultLang = 'pt';

/**
 * Alterna entre os idiomas disponíveis
 * @param {string} lang - Código do idioma (pt/en)
 */
function switchLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    updatePageContent();
    localStorage.setItem('preferredLang', lang);
}

/**
 * Atualiza o conteúdo da página com base no idioma
 */
function updatePageContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang]?.[key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = i18n[currentLang][key];
            } else {
                el.textContent = i18n[currentLang][key];
            }
        }
    });
}

/**
 * Inicializa a página com o idioma preferido
 */
function initializePage() {
    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
    switchLang(savedLang || browserLang || defaultLang);

    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Utilidades para manipulação de strings
 */
const utils = {
    /**
     * Remove caracteres especiais de uma string
     */
    cleanString: (str) => str.replace(/[^0-9a-zA-Z]/g, ''),

    /**
     * Formata um CPF (XXX.XXX.XXX-XX)
     */
    formatCPF: (cpf) => {
        const cleaned = utils.cleanString(cpf);
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    /**
     * Formata um CNPJ (XX.XXX.XXX/XXXX-XX)
     */
    formatCNPJ: (cnpj) => {
        const cleaned = utils.cleanString(cnpj);
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
};

/**
 * Função para copiar texto para a área de transferência
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Erro ao copiar texto:', err);
        return false;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializePage);

// Exporta funções e objetos úteis
window.switchLang = switchLang;
window.utils = utils;
window.copyToClipboard = copyToClipboard;

