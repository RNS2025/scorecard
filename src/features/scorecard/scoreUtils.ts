export function getScoreOptions(sport: string, holePar: number): number[] {
    switch (sport.toLowerCase()) {
        case "fodboldgolf": {
            const max = holePar * 2;
            const options = Array.from({ length: max }, (_, i) => i + 1);
            options.push(max + 1);
            return options;
        }
        case "minigolf": {
            const options = Array.from({ length: 8 }, (_, i) => i + 1);
            options.push(10);
            return options;
        }
        default: {
            const max = holePar * 2;
            const options = Array.from({ length: max }, (_, i) => i + 1);
            options.push(max + 1);
            return options;
        }
    }
}

export function getScoreDescription(sport: string, holePar: number): string {
    switch (sport.toLowerCase()) {
        case "fodboldgolf": {
            const max = holePar * 2;
            return `Maks. antal forsøg er hullets par ganget med 2 (${max}). Lykkedes det ikke på sidste forsøg vælges ${max + 1}.`;
        }
        case "minigolf":
            return `Du har 8 forsøg. Lykkedes det ikke på 8. forsøg vælges 10.`;
        default: {
            const max = holePar * 2;
            return `Maks. antal forsøg er hullets par ganget med 2 (${max}). Lykkedes det ikke på sidste forsøg vælges ${max + 1}.`;
        }
    }
}
