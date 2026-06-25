import { create } from 'zustand';
import { Equipment } from '../data/equipment';

interface GameState {
  playerLevel: number;
  playerXp: number;
  inventory: Equipment[];
  equippedRelics: Record<string, Equipment[]>; 
  team: string[]; 

  // Estado da API
  characters: any[];
  isLoadingCharacters: boolean;
  fetchCharacters: () => Promise<void>;

  // Ações
  addXp: (amount: number) => void;
  addRelicToInventory: (relic: Equipment) => void;
  equipRelic: (charId: string, relic: Equipment) => void;
  unequipRelic: (charId: string, relicId: string) => void;
  toggleTeamMember: (charId: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerLevel: 1,
  playerXp: 0,
  inventory: [],
  equippedRelics: {},
  team: [],

  characters: [],
  isLoadingCharacters: false,

  fetchCharacters: async () => {
    set({ isLoadingCharacters: true });
    try {
      const response = await fetch('https://gist.githubusercontent.com/Theodlc/175c97c4b5e9bfe5b9c291e3b5df6d3d/raw/characters.json');
      const data = await response.json();
      set({ characters: data, isLoadingCharacters: false });
    } catch (error) {
      console.error("Erro ao buscar heróis da API:", error);
      set({ isLoadingCharacters: false });
    }
  },

  addXp: (amount) => set((state) => {
    let newXp = state.playerXp + amount;
    let newLevel = state.playerLevel;
    let xpNeeded = newLevel * 100;
    
    while (newXp >= xpNeeded) {
      newLevel += 1;
      newXp -= xpNeeded;
      xpNeeded = newLevel * 100;
    }
    
    return { playerXp: newXp, playerLevel: newLevel };
  }),

  addRelicToInventory: (relic) => set((state) => ({ 
    inventory: [...state.inventory, relic] 
  })),

  equipRelic: (charId, relic) => set((state) => {
    const charRelics = state.equippedRelics[charId] || [];
    if (charRelics.length >= 4) return state; 
    
    return {
      inventory: state.inventory.filter(item => item.id !== relic.id),
      equippedRelics: {
        ...state.equippedRelics,
        [charId]: [...charRelics, relic]
      }
    };
  }),

  unequipRelic: (charId, relicId) => set((state) => {
    const charRelics = state.equippedRelics[charId] || [];
    const relicToUnequip = charRelics.find(r => r.id === relicId);
    
    if (!relicToUnequip) return state;

    return {
      equippedRelics: {
        ...state.equippedRelics,
        [charId]: charRelics.filter(r => r.id !== relicId)
      },
      inventory: [...state.inventory, relicToUnequip]
    };
  }),

  toggleTeamMember: (charId) => set((state) => {
    const exists = state.team.includes(charId);
    if (exists) {
      return { team: state.team.filter(id => id !== charId) };
    }
    if (state.team.length >= 4) return state;
    return { team: [...state.team, charId] };
  })
}));