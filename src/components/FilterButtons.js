import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FilterButtons({
  activeFilter,
  setActiveFilter,
}) {
  const filters = [
    'Todos',
    '4-star',
    '5-star',
    'Favoritos',
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.button,
              activeFilter === filter
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.buttonText,
                activeFilter === filter
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {filter === 'Todos'
                ? '✨ Todos'
                : filter === '4-star'
                ? '⭐ 4 Estrelas'
                : filter === '5-star'
                ? '👑 5 Estrelas'
                : '❤️ Favoritos'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 55,
    marginBottom: 15,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  activeButton: {
    backgroundColor: '#9d77e0',
    borderColor: '#9d77e0',
  },
  inactiveButton: {
    backgroundColor: '#161a2e',
    borderColor: '#2a2f45',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeText: {
    color: '#ffffff',
  },
  inactiveText: {
    color: '#b0b0b0',
  },
});