import { Storage } from './storage';

// 카드 데이터 관리
export const Cards = {
    getAll: (projectId) => {
        const allCards = Storage.get('cards') || [];
        return projectId ? allCards.filter(c => c.projectId === projectId) : allCards;
    },
    add: (card) => {
        const cards = Cards.getAll();
        cards.push({
            ...card,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });
        Storage.set('cards', cards);
        return cards;
    },
    remove: (id) => {
        const cards = Cards.getAll();
        const filtered = cards.filter(c => c.id !== id);
        Storage.set('cards', filtered);
        return filtered;
    }
};

