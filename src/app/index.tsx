import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CharacterCard from '../components/CharacterCard';
import FilterButtons from '../components/FilterButtons';
import { bosses } from '../data/bosses';
import { charactersData } from '../data/characters'; 
import { Equipment, generateReward } from '../data/equipment';
import { useGameStore } from '../store/gameStore';

interface Character {
  id: string;
  name: string;
  path: string;
  element: string;
  rarity: string;
  hp: number;
  atk: number;
  def: number;
  image?: any;
  statusImage?: any;
  color: string;
  bio: string;
  bonusHp?: number;
  bonusAtk?: number;
  bonusDef?: number;
  equippedRelic?: Equipment;
}

export default function HomeScreen() {
  const apiCharacters = useGameStore((state) => state.characters);
  const isLoadingCharacters = useGameStore((state) => state.isLoadingCharacters);
  const fetchCharacters = useGameStore((state) => state.fetchCharacters);

  const playerLevel = useGameStore((state) => state.playerLevel);
  const playerXp = useGameStore((state) => state.playerXp);
  const globalTeamIds = useGameStore((state) => state.team);
  const equippedRelics = useGameStore((state) => state.equippedRelics);
  
  const toggleTeamMemberGlobal = useGameStore((state) => state.toggleTeamMember);
  const addRelicToInventory = useGameStore((state) => state.addRelicToInventory);
  const addXp = useGameStore((state) => state.addXp);

  const [filter, setFilter] = useState('Todos');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [battleModalVisible, setBattleModalVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [battleState, setBattleState] = useState<'idle' | 'victory' | 'defeat' | 'reward'>('idle');
  const [rewardOptions, setRewardOptions] = useState<Equipment[]>([]);

  useEffect(() => {
    if (apiCharacters.length === 0) {
      fetchCharacters();
    }
  }, []);

  // ---> A MÁGICA DO GAME DESIGN AQUI <---
  // Cada nível ganho dá +20% de status base para a conta inteira
  const levelMultiplier = 1 + (playerLevel - 1) * 0.2;

  const characters: Character[] = apiCharacters.map((apiChar) => {
    const local = charactersData.find((c) => c.id === apiChar.id);
    return {
      ...apiChar,
      // Aplicando o multiplicador de nível nos status base da API:
      hp: Math.floor(apiChar.hp * levelMultiplier),
      atk: Math.floor(apiChar.atk * levelMultiplier),
      def: Math.floor(apiChar.def * levelMultiplier),
      image: local ? local.image : null,
      statusImage: local ? local.statusImage : null,
    };
  });

  const currentBoss = bosses.find((b) => b.level === playerLevel) || bosses[bosses.length - 1];
  const xpNeededForNextLevel = playerLevel * 100;

  const filteredCharacters = characters.filter((char) => {
    if (filter === '4-star') return char.rarity === '⭐⭐⭐⭐';
    if (filter === '5-star') return char.rarity === '⭐⭐⭐⭐⭐';
    if (filter === 'Favoritos') return favorites.includes(char.id);
    return true;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const team = globalTeamIds.map(id => {
    const char = characters.find(c => c.id === id);
    if (!char) return null;
    
    const charRelics = equippedRelics[id] || [];
    const bonusHp = charRelics.reduce((sum, r) => sum + r.bonus.hp, 0);
    const bonusAtk = charRelics.reduce((sum, r) => sum + r.bonus.atk, 0);
    const bonusDef = charRelics.reduce((sum, r) => sum + r.bonus.def, 0);

    return { 
      ...char, 
      equippedRelic: charRelics[0], 
      bonusHp, 
      bonusAtk, 
      bonusDef 
    };
  }).filter(Boolean) as any[];

  const totalHP = team.reduce((sum, c) => sum + c.hp + c.bonusHp, 0);
  const totalATK = team.reduce((sum, c) => sum + c.atk + c.bonusAtk, 0);
  const totalDEF = team.reduce((sum, c) => sum + c.def + c.bonusDef, 0);

  const power = Math.floor(totalATK + totalDEF + totalHP * 0.25);
  const enemyPower = currentBoss.power;

  const handleBattle = () => {
    if (power >= enemyPower) {
      setBattleState('victory');
    } else {
      setBattleState('defeat');
    }
  };

  const handleVictory = () => {
    setRewardOptions([generateReward('HP'), generateReward('ATK')]);
    setBattleState('reward');
  };

  const handleClaimReward = (selectedItem: Equipment) => {
    addRelicToInventory(selectedItem);
    addXp(50);
    setBattleState('idle');
    setBattleModalVisible(false);
  };

  const handleDefeat = () => {
    setBattleState('idle');
    setBattleModalVisible(false);
  };

  if (isLoadingCharacters || characters.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color="#48bfe3" />
        <Text style={styles.loadingText}>Sincronizando com o Servidor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.teamSection}>
          <View style={styles.levelHeader}>
            <Text style={styles.title}>Nível {playerLevel}</Text>
            <Text style={styles.buffText}>⚡ Bônus de Atributos: +{Math.round((levelMultiplier - 1) * 100)}%</Text>
          </View>
          
          <Text style={styles.powerText}>Poder da Equipe: {power}</Text>

          <View style={styles.xpContainer}>
            <View style={[styles.xpBar, { width: `${Math.min((playerXp / xpNeededForNextLevel) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.xpText}>XP: {playerXp}/{xpNeededForNextLevel}</Text>

          <View style={styles.teamSlots}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.slot,
                  team[index] && { borderColor: team[index].color },
                ]}
              >
                {team[index] ? (
                  <>
                    {team[index].image && <Image source={team[index].image} style={styles.slotImage} />}
                    {team[index].equippedRelic && (
                      <View style={styles.equippedIcon}>
                        <Text style={{ fontSize: 10 }}>{team[index].equippedRelic.icon}</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.plus}>+</Text>
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.battleButton}
            disabled={team.length === 0}
            onPress={() => setBattleModalVisible(true)}
          >
            <Text style={styles.buttonText}>⚔️ {currentBoss.name}</Text>
            <Text style={styles.enemyPowerText}>Poder Necessário: {enemyPower}</Text>
          </TouchableOpacity>
        </View>

        <FilterButtons activeFilter={filter} setActiveFilter={setFilter} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
          {filteredCharacters.map((char) => (
            <View key={char.id} style={styles.cardWrapper}>
              <CharacterCard
                name={char.name}
                path={char.path}
                element={char.element}
                rarity={char.rarity}
                bio={char.bio}
                color={char.color}
                image={char.image}
                isSelected={globalTeamIds.includes(char.id)}
                isFavorite={favorites.includes(char.id)}
                onFavoritePress={() => toggleFavorite(char.id)}
                onPress={() => setSelectedCharacter(char)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modal de Batalha */}
      <Modal visible={battleModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {battleState === 'idle' && (
              <>
                <Text style={styles.modalTitle}>{currentBoss.name}</Text>
                <Text style={styles.modalText}>Seu Poder: {power}</Text>
                <Text style={styles.modalText}>Poder do Chefe: {enemyPower}</Text>

                <TouchableOpacity style={styles.modalButton} onPress={handleBattle}>
                  <Text style={styles.buttonText}>Iniciar Combate</Text>
                </TouchableOpacity>
              </>
            )}

            {battleState === 'victory' && (
              <>
                <Text style={styles.victory}>🎉 VITÓRIA</Text>
                <TouchableOpacity style={styles.modalButton} onPress={handleVictory}>
                  <Text style={styles.buttonText}>Receber Recompensas</Text>
                </TouchableOpacity>
              </>
            )}

            {battleState === 'reward' && (
              <>
                <Text style={[styles.victory, { fontSize: 20, marginBottom: 15 }]}>
                  🎁 Escolha sua Recompensa
                </Text>

                {rewardOptions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.modalButton}
                    onPress={() => handleClaimReward(item)}
                  >
                    <Text style={styles.buttonText}>
                      {item.icon} {item.name}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                      +{item.bonus.hp > 0 ? `${item.bonus.hp} HP` : `${item.bonus.atk} ATK`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {battleState === 'defeat' && (
              <>
                <Text style={styles.defeat}>☠️ DERROTA</Text>
                <TouchableOpacity style={styles.modalButton} onPress={handleDefeat}>
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Herói detalhado */}
      <Modal visible={selectedCharacter !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selectedCharacter && (
              <>
                {selectedCharacter.image && (
                  <Image 
                    source={selectedCharacter.statusImage || selectedCharacter.image} 
                    style={styles.characterImage} 
                  />
                )}
                <Text style={styles.modalTitle}>{selectedCharacter.name}</Text>
                <Text style={styles.modalText}>{selectedCharacter.bio}</Text>
                
                <View style={styles.statusBox}>
                  <Text style={styles.statusBoxTitle}>Atributos (Escalados Nv. {playerLevel})</Text>
                  <Text style={styles.statusBoxValues}>❤️ HP: {selectedCharacter.hp} | ⚔️ ATK: {selectedCharacter.atk} | 🛡️ DEF: {selectedCharacter.def}</Text>
                </View>

                <Text style={[styles.modalText, { marginTop: 10, fontSize: 11, color: '#48bfe3' }]}>
                   Equipe relíquias na aba 'Equipe' para subir ainda mais.
                </Text>
                
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    toggleTeamMemberGlobal(selectedCharacter.id);
                    setSelectedCharacter(null);
                  }}
                >
                  <Text style={styles.buttonText}>
                    {globalTeamIds.includes(selectedCharacter.id) ? 'Remover do Time' : 'Adicionar ao Time'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedCharacter(null)}>
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d17' },
  centerAll: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#48bfe3', marginTop: 12, fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  teamSection: { backgroundColor: '#161a2e', padding: 15, borderRadius: 15, marginBottom: 15 },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  buffText: { color: '#ffd700', fontSize: 12, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  powerText: { color: '#48bfe3', marginTop: 8, marginBottom: 8, fontWeight: 'bold', fontSize: 16 },
  xpContainer: { height: 12, backgroundColor: '#2a2f45', borderRadius: 20, overflow: 'hidden' },
  xpBar: { height: '100%', backgroundColor: '#48bfe3' },
  xpText: { color: '#fff', marginTop: 5, marginBottom: 15, fontSize: 12 },
  teamSlots: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  slot: { width: 70, height: 70, borderRadius: 10, borderWidth: 2, borderColor: '#2a2f45', justifyContent: 'center', alignItems: 'center', backgroundColor: '#101423' },
  slotImage: { width: '100%', height: '100%', borderRadius: 8 },
  equippedIcon: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#161a2e', borderRadius: 10, padding: 2, borderWidth: 1, borderColor: '#48bfe3' },
  plus: { color: '#48bfe3', fontSize: 24 },
  battleButton: { backgroundColor: '#ff4444', padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  enemyPowerText: { color: '#fff', marginTop: 5, fontSize: 12 },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 40 },
  cardWrapper: { width: '48%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', backgroundColor: '#161a2e', padding: 20, borderRadius: 20, alignItems: 'center', maxHeight: '85%' },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalText: { color: '#b0b0b0', marginBottom: 12, textAlign: 'center', fontSize: 13 },
  statusBox: { backgroundColor: '#101423', padding: 12, borderRadius: 10, width: '100%', borderWidth: 1, borderColor: '#2a2f45', alignItems: 'center' },
  statusBoxTitle: { color: '#ffd700', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  statusBoxValues: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  modalButton: { backgroundColor: '#48bfe3', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  closeButton: { backgroundColor: '#ff4444', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  victory: { color: '#00ff88', fontSize: 24, fontWeight: 'bold' },
  defeat: { color: '#ff5555', fontSize: 24, fontWeight: 'bold' },
  characterImage: { width: '100%', height: 220, borderRadius: 15, marginBottom: 12, resizeMode: 'contain' }
});