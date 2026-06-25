import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { charactersData } from '../data/characters';
import { useGameStore } from '../store/gameStore';

export default function TeamScreen() {
  const [selectedId, setSelectedId] = useState(charactersData[0]?.id);
  const [activeTab, setActiveTab] = useState<'stats' | 'relics'>('stats');

  // Conectando com o estado real do jogo
  const inventory = useGameStore((state) => state.inventory);
  const equippedRelics = useGameStore((state) => state.equippedRelics);
  const equipRelic = useGameStore((state) => state.equipRelic);
  const unequipRelic = useGameStore((state) => state.unequipRelic);

  const selectedChar = charactersData.find(c => c.id === selectedId) || charactersData[0];
  
  // Busca as relíquias atualmente equipadas NESTE personagem específico
  const charRelics = equippedRelics[selectedChar.id] || [];

  // Calcula os bônus REAIS somando o que está equipado nele
  const totalHpBonus = charRelics.reduce((acc, item) => acc + (item.bonus.hp || 0), 0);
  const totalAtkBonus = charRelics.reduce((acc, item) => acc + (item.bonus.atk || 0), 0);
  const totalDefBonus = charRelics.reduce((acc, item) => acc + (item.bonus.def || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛡️ Equipe e Arsenal</Text>
        <Text style={styles.headerSubtitle}>Gerencie seus heróis e equipamentos</Text>
      </View>

      {/* Carrossel de Seleção de Personagens */}
      <View style={styles.rosterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rosterScroll}>
          {charactersData.map(char => (
            <TouchableOpacity
              key={char.id}
              style={[
                styles.rosterAvatar, 
                selectedId === char.id && { borderColor: char.color, borderWidth: 2 }
              ]}
              onPress={() => setSelectedId(char.id)}
            >
              <Image source={char.image} style={styles.avatarImage} />
              {selectedId === char.id && <View style={[styles.activeIndicator, { backgroundColor: char.color }]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Detalhes do Personagem Selecionado */}
      {selectedChar && (
        <ScrollView contentContainerStyle={styles.detailsContainer} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.mainCard, { borderColor: selectedChar.color }]}>
            <Image 
              source={selectedChar.statusImage || selectedChar.image} 
              style={styles.mainImage} 
            />
            <View style={styles.nameBadge}>
              <Text style={styles.charName}>{selectedChar.name}</Text>
              <Text style={styles.charDetails}>{selectedChar.rarity} | {selectedChar.element}</Text>
            </View>
          </View>

          {/* Abas de Navegação */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'stats' && styles.tabActive]} 
              onPress={() => setActiveTab('stats')}
            >
              <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>📊 Atributos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'relics' && styles.tabActive]} 
              onPress={() => setActiveTab('relics')}
            >
              <Text style={[styles.tabText, activeTab === 'relics' && styles.tabTextActive]}>🎒 Relíquias</Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo das Abas Dinâmico */}
          {activeTab === 'stats' ? (
            <View style={styles.infoCard}>
              <StatRow icon="❤️" label="HP Máximo" base={selectedChar.hp} bonus={totalHpBonus} />
              <View style={styles.divider} />
              <StatRow icon="⚔️" label="Ataque (ATK)" base={selectedChar.atk} bonus={totalAtkBonus} />
              <View style={styles.divider} />
              <StatRow icon="🛡️" label="Defesa (DEF)" base={selectedChar.def} bonus={totalDefBonus} />
              
              <Text style={styles.tipText}>* Valores em verde são bônus reais de relíquias equipadas.</Text>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Equipados no Herói</Text>
              <View style={styles.relicGrid}>
                {[0, 1, 2, 3].map((index) => {
                  const item = charRelics[index];
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.relicSlot, !item && styles.relicSlotEmpty]}
                      onPress={() => item && unequipRelic(selectedChar.id, item.id)}
                    >
                      {item ? (
                        <>
                          <Text style={styles.relicIcon}>{item.icon}</Text>
                          <Text style={styles.relicName} numberOfLines={1}>{item.name}</Text>
                          <Text style={styles.removeText}>Remover</Text>
                        </>
                      ) : (
                        <Text style={styles.emptyIcon}>+</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Mochila / Inventário de Itens */}
              <Text style={styles.sectionTitle}>🎒 Mochila de Sobras ({inventory.length})</Text>
              {inventory.length === 0 ? (
                <Text style={styles.emptyText}>Vá na aba Explorar e derrote chefes para ganhar relíquias!</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.inventoryScroll}>
                  {inventory.map((item) => (
                    <TouchableOpacity 
                      key={item.id} 
                      style={styles.inventoryItemCard}
                      onPress={() => equipRelic(selectedChar.id, item)}
                    >
                      <Text style={styles.inventoryItemIcon}>{item.icon}</Text>
                      <Text style={styles.inventoryItemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.inventoryItemBonus}>
                        {item.bonus.hp > 0 ? `❤️+${item.bonus.hp}` : `⚔️+${item.bonus.atk}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ==========================================
// COMPONENTE FALTANTE ADICIONADO AQUI:
// ==========================================
const StatRow = ({ icon, label, base, bonus }: any) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{icon} {label}</Text>
    <View style={styles.statValues}>
      <Text style={styles.statBase}>{base}</Text>
      <Text style={styles.statBonus}> +{bonus}</Text>
    </View>
  </View>
);

// ==========================================
// ESTILOS UNIFICADOS
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d17' },
  header: { padding: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#777', fontSize: 14 },
  
  rosterContainer: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#161a2e' },
  rosterScroll: { paddingHorizontal: 15 },
  rosterAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: '#161a2e', borderWidth: 2, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 56, height: 56, borderRadius: 28 },
  activeIndicator: { position: 'absolute', bottom: -5, width: 10, height: 10, borderRadius: 5 },
  
  detailsContainer: { padding: 20, paddingBottom: 40 },
  mainCard: { width: '100%', height: 260, backgroundColor: '#161a2e', borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  nameBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(22, 26, 46, 0.95)' },
  charName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  charDetails: { color: '#48bfe3', fontSize: 13, marginTop: 2 },
  
  tabContainer: { flexDirection: 'row', backgroundColor: '#161a2e', borderRadius: 12, padding: 5, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#2a2f45' },
  tabText: { color: '#777', fontWeight: 'bold' },
  tabTextActive: { color: '#fff' },
  
  infoCard: { backgroundColor: '#161a2e', borderRadius: 15, padding: 20 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  statLabel: { color: '#b0b0b0', fontSize: 15 },
  statValues: { flexDirection: 'row', alignItems: 'center' },
  statBase: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statBonus: { color: '#00ff88', fontSize: 15, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#2a2f45', marginVertical: 10 },
  tipText: { color: '#777', fontSize: 11, fontStyle: 'italic', marginTop: 15, textAlign: 'center' },

  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  removeText: { color: '#ff4444', fontSize: 11, marginTop: 5, fontWeight: 'bold' },
  emptyText: { color: '#777', fontSize: 13, textAlign: 'center', marginVertical: 15, fontStyle: 'italic' },
  
  relicGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  relicSlot: { width: '48%', backgroundColor: '#101423', borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#2a2f45', position: 'relative' },
  relicSlotEmpty: { borderStyle: 'dashed', borderColor: '#48bfe3', justifyContent: 'center' },
  relicIcon: { fontSize: 28, marginVertical: 8 },
  relicName: { color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  emptyIcon: { color: '#48bfe3', fontSize: 22, paddingVertical: 10 },

  inventoryScroll: { flexDirection: 'row', marginTop: 10 },
  inventoryItemCard: { backgroundColor: '#101423', padding: 12, borderRadius: 10, alignItems: 'center', marginRight: 10, width: 110, borderWidth: 1, borderColor: '#48bfe3' },
  inventoryItemIcon: { fontSize: 28, marginBottom: 5 },
  inventoryItemName: { color: '#fff', fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  inventoryItemBonus: { color: '#00ff88', fontSize: 12, marginTop: 4, fontWeight: 'bold' }
});