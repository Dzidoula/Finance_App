/**
 * Gestion du menu simple
 */
class SimpleMenu {
    constructor() {
        this.menu = document.getElementById('sidebar');
        this.menuToggle = document.getElementById('menuToggle');
        
        this.init();
    }
    
    init() {
        // Gestion du clic sur le toggle (mobile)
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        // Gestion des clics sur les liens
        const menuLinks = this.menu.querySelectorAll('a[href^="#"]');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Marquer le lien comme actif
                this.setActiveLink(link);
                
                // Sur mobile, fermer le menu après clic
                if (window.innerWidth <= 768) {
                    this.menu.classList.remove('mobile-open');
                }
            });
        });
        
        // Fermer le menu en cliquant à l'extérieur (mobile)
        document.addEventListener('click', (e) => {
            if (this.menu.classList.contains('mobile-open') && !this.menu.contains(e.target)) {
                this.menu.classList.remove('mobile-open');
            }
        });
        
        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Initialiser l'état du menu
        this.handleResize();
    }
    
    toggleMenu() {
        this.menu.classList.toggle('mobile-open');
    }
    
    setActiveLink(activeLink) {
        // Retirer la classe active de tous les liens
        const allLinks = this.menu.querySelectorAll('a');
        allLinks.forEach(link => link.classList.remove('active'));
        
        // Ajouter la classe active au lien cliqué
        activeLink.classList.add('active');
    }
    
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Sur mobile, le menu est en bas
            this.menu.classList.add('mobile');
            this.menu.classList.remove('mobile-open');
        } else {
            // Sur desktop, le menu est sur le côté
            this.menu.classList.remove('mobile', 'mobile-open');
        }
    }
}

// Initialiser le menu quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new SimpleMenu();
});

// Export pour utilisation dans d'autres modules
export default SimpleMenu;
