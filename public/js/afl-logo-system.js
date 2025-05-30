// AFL Team Logo System - Text-based fallback
class AFLLogoSystem {
    constructor() {
        this.teamData = {
            'afl-adelaide': { name: 'Adelaide Crows', abbr: 'ADE', bg: '#002f5f', color: '#ffd700' },
            'afl-brisbane': { name: 'Brisbane Lions', abbr: 'BL', bg: '#a30046', color: '#f37021' },
            'afl-carlton': { name: 'Carlton Blues', abbr: 'CAR', bg: '#002f5f', color: '#ffffff' },
            'afl-collingwood': { name: 'Collingwood Magpies', abbr: 'COL', bg: '#000000', color: '#ffffff' },
            'afl-essendon': { name: 'Essendon Bombers', abbr: 'ESS', bg: '#cc0000', color: '#000000' },
            'afl-fremantle': { name: 'Fremantle Dockers', abbr: 'FRE', bg: '#2a0e4f', color: '#ffffff' },
            'afl-geelong': { name: 'Geelong Cats', abbr: 'GEE', bg: '#001f3f', color: '#ffffff' },
            'afl-goldcoast': { name: 'Gold Coast Suns', abbr: 'GC', bg: '#f4002e', color: '#fed102' },
            'afl-gws': { name: 'GWS Giants', abbr: 'GWS', bg: '#f15a22', color: '#4a4a4a' },
            'afl-hawthorn': { name: 'Hawthorn Hawks', abbr: 'HAW', bg: '#4d2004', color: '#fbbf15' },
            'afl-melbourne': { name: 'Melbourne Demons', abbr: 'MEL', bg: '#003c71', color: '#cc0000' },
            'afl-northmelbourne': { name: 'North Melbourne Kangaroos', abbr: 'NM', bg: '#003c71', color: '#ffffff' },
            'afl-portadelaide': { name: 'Port Adelaide Power', abbr: 'PA', bg: '#008aab', color: '#000000' },
            'afl-richmond': { name: 'Richmond Tigers', abbr: 'RIC', bg: '#000000', color: '#ffd200' },
            'afl-stkilda': { name: 'St Kilda Saints', abbr: 'STK', bg: '#ed0f05', color: '#ffffff' },
            'afl-sydney': { name: 'Sydney Swans', abbr: 'SYD', bg: '#ed171f', color: '#ffffff' },
            'afl-westcoast': { name: 'West Coast Eagles', abbr: 'WC', bg: '#002b5c', color: '#f2a900' },
            'afl-bulldogs': { name: 'Western Bulldogs', abbr: 'WB', bg: '#014896', color: '#dc2830' }
        };
    }

    createTextLogo(theme) {
        const team = this.teamData[theme];
        if (!team) return null;

        // Create a canvas element to generate logo
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        // Background circle
        ctx.fillStyle = team.colors[0];
        ctx.beginPath();
        ctx.arc(50, 50, 45, 0, 2 * Math.PI);
        ctx.fill();

        // Inner circle
        if (team.colors[1]) {
            ctx.fillStyle = team.colors[1];
            ctx.beginPath();
            ctx.arc(50, 50, 35, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Text
        ctx.fillStyle = team.colors.length > 2 ? team.colors[2] : team.colors[1];
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(team.abbr, 50, 50);

        return canvas.toDataURL();
    }

    isAFLTheme(theme) {
        return theme && theme.startsWith('afl-') && this.teamData.hasOwnProperty(theme);
    }

    updateLogoElement(logoElement, theme) {
        const team = this.teamData[theme];
        if (!team) {
            console.error('Team not found for theme:', theme);
            return false;
        }

        // Remove any existing AFL logo container
        this.removeTextLogo(logoElement);

        // Create a styled div to replace the image
        const logoContainer = document.createElement('div');
        logoContainer.className = 'afl-logo-container';
        logoContainer.style.cssText = `
            width: 45px;
            height: 45px;
            background-color: ${team.bg};
            color: ${team.color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
        `;
        
        logoContainer.textContent = team.abbr;
        logoContainer.title = team.name;
        
        // Insert after the logo element
        logoElement.parentNode.insertBefore(logoContainer, logoElement.nextSibling);
        
        return true;
    }

    removeTextLogo(logoElement) {
        const textLogos = logoElement.parentNode.querySelectorAll('.afl-logo-container, .afl-text-logo');
        textLogos.forEach(el => el.remove());
    }
}

// Export for use in theme-switcher
window.AFLLogoSystem = AFLLogoSystem;