import { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bosses } from '../data/bosses';
import { Equipment, generateReward } from '../data/equipment';
import { useGameStore } from '../store/gameStore';

export default function ExploreScreen() {
  const addRelicToInventory = useGameStore((state) => state.addRelicToInventory);
  const addXp = useGameStore((state) => state.addXp); 
  
  const playerLevel = useGameStore((state) => state.playerLevel);
  const playerXp = useGameStore((state) => state.playerXp);

  const [modalVisible, setModalVisible] = useState(false);
  const [battleResult, setBattleResult] = useState<'idle' | 'victory'>('idle');
  const [reward, setReward] = useState<Equipment | null>(null);

  const [afkXp, setAfkXp] = useState(0);

  // O Timer agora acumula apenas a Experiência pura
  useEffect(() => {
    const interval = setInterval(() => {
      setAfkXp((prev) => prev + 15);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaimAFK = () => {
    if (afkXp > 0) {
      addXp(afkXp);     
      setAfkXp(0);
    }
  };

  const currentBoss = bosses.find((b) => b.level === playerLevel) || bosses[bosses.length - 1];
  const xpNeededForNextLevel = playerLevel * 100;

  const handleBattle = () => {
    const type = Math.random() > 0.5 ? 'HP' : 'ATK';
    const itemGanho = generateReward(type);
    setReward(itemGanho);
    setBattleResult('victory');
  };

  const handleClaimBoss = () => {
    if (reward) {
      addRelicToInventory(reward);
      addXp(150); 
    }
    setBattleResult('idle');
    setReward(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>🗺️ Explorar</Text>
            <Text style={styles.subtitle}>Evolua sua conta</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Nv. {playerLevel}</Text>
              <Text style={styles.xpText}>{playerXp} / {xpNeededForNextLevel} XP</Text>
            </View>
          </View>
        </View>

        <View style={styles.afkCard}>
          <Text style={styles.afkTitle}>⏳ Treinamento AFK</Text>
          <Text style={styles.afkText}>Seus heróis estão treinando sozinhos...</Text>
          
          <View style={styles.afkLootContainer}>
            <View style={styles.afkLootBox}>
              <Text style={styles.afkXpText}>✨ {afkXp}</Text>
              <Text style={styles.afkLabel}>XP Acumulado</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.afkButton, afkXp === 0 && styles.buttonDisabled]} 
            onPress={handleClaimAFK}
            disabled={afkXp === 0}
          >
            <Text style={styles.afkButtonText}>Absorver Experiência</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bossCard}>
          <Text style={styles.bossTitle}>Chefe de Região (Nv. {playerLevel})</Text>
          <Text style={styles.bossName}>👾 {currentBoss.name}</Text>
          <Text style={styles.bossPower}>Derrote para ganhar relíquias!</Text>

          <TouchableOpacity style={styles.battleButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Enfrentar Chefe</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {battleResult === 'idle' ? (
              <>
                <Text style={styles.modalTitle}>Combate Iniciado!</Text>
                <Text style={styles.modalText}>Lutando contra {currentBoss.name}...</Text>
                <TouchableOpacity style={styles.modalButton} onPress={handleBattle}>
                  <Text style={styles.buttonText}>Finalizar Turno</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.victoryTitle}>🎉 VITÓRIA!</Text>
                <Text style={styles.modalText}>Você ganhou 150 XP e uma nova relíquia:</Text>
                
                {reward && (
                  <View style={styles.rewardBox}>
                    <Text style={styles.rewardIcon}>{reward.icon}</Text>
                    <Text style={styles.rewardName}>{reward.name}</Text>
                    <Text style={styles.rewardBonus}>
                      {reward.bonus.hp > 0 ? `❤️ +${reward.bonus.hp} HP` : `⚔️ +${reward.bonus.atk} ATK`}
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: '#00ff88', marginTop: 15 }]} 
                  onPress={handleClaimBoss}
                >
                  <Text style={[styles.buttonText, { color: '#0b0d17' }]}>Coletar Recompensa</Text>
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
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitles: { flex: 1 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 2 },
  subtitle: { color: '#777', fontSize: 14 },
  statsContainer: { alignItems: 'flex-end' },
  levelBadge: { backgroundColor: '#48bfe3', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, alignItems: 'flex-end' },
  levelText: { color: '#0b0d17', fontWeight: 'bold', fontSize: 16 },
  xpText: { color: '#0b0d17', fontSize: 10, fontWeight: 'bold' },
  afkCard: { backgroundColor: '#101423', padding: 20, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#b026ff', marginBottom: 20 },
  afkTitle: { color: '#b026ff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  afkText: { color: '#b0b0b0', fontSize: 13, textAlign: 'center', marginBottom: 15 },
  afkLootContainer: { width: '100%', marginBottom: 15 },
  afkLootBox: { backgroundColor: '#161a2e', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center' },
  afkXpText: { color: '#48bfe3', fontSize: 28, fontWeight: 'bold' },
  afkLabel: { color: '#777', fontSize: 11, marginTop: 4, textTransform: 'uppercase', fontWeight: 'bold' },
  afkButton: { backgroundColor: '#b026ff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, width: '100%', alignItems: 'center' },
  afkButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonDisabled: { backgroundColor: '#2a2f45', opacity: 0.7 },
  bossCard: { backgroundColor: '#161a2e', padding: 20, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#ff4444' },
  bossTitle: { color: '#ff4444', fontWeight: 'bold', fontSize: 12, marginBottom: 5, textTransform: 'uppercase' },
  bossName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  bossPower: { color: '#b0b0b0', marginBottom: 20 },
  battleButton: { backgroundColor: '#ff4444', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '85%', backgroundColor: '#161a2e', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  victoryTitle: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalText: { color: '#b0b0b0', textAlign: 'center', marginBottom: 15 },
  modalButton: { backgroundColor: '#48bfe3', padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
  rewardBox: { backgroundColor: '#101423', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#48bfe3', marginVertical: 10 },
  rewardIcon: { fontSize: 35, marginBottom: 5 },
  rewardName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  rewardBonus: { color: '#48bfe3', fontWeight: 'bold', marginTop: 4, fontSize: 14 }
});