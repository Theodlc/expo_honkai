export interface Equipment {
  id: string;
  name: string;
  icon: string;
  bonus: { hp: number; atk: number; def: number };
}

export const generateReward = (focus: 'HP' | 'ATK'): Equipment => {
  const uniqueId = Math.random().toString(36).substring(7); // Gera um ID único
  
  if (focus === 'HP') {
    return {
      id: `relic_${uniqueId}`,
      name: 'Cálice da Vida',
      icon: '❤️',
      bonus: { 
        hp: Math.floor(Math.random() * 200) + 150, // Dá entre 150 e 350 de HP
        atk: 0, 
        def: 0 
      }
    };
  } else {
    return {
      id: `relic_${uniqueId}`,
      name: 'Lâmina da Fúria',
      icon: '⚔️',
      bonus: { 
        hp: 0, 
        atk: Math.floor(Math.random() * 100) + 50, // Dá entre 50 e 150 de ATK
        def: 0 
      }
    };
  }
};