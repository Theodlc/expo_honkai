import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CharacterCard({
  name,
  path,
  element,
  rarity,
  bio,
  color,
  image,
  isSelected,
  isFavorite,
  onFavoritePress,
  onPress,
}) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View
        style={[
          styles.card,
          {
            borderColor: color,
            opacity: isSelected ? 0.7 : 1,
          },
        ]}
      >
        <Image source={image} style={styles.characterImage} />

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>
              {name} {isSelected ? '✅' : ''}
            </Text>

            <TouchableOpacity onPress={onFavoritePress}>
              <Text style={styles.likeButton}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.rarity}>{rarity}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{path}</Text>
            </View>

            <View style={[styles.badge, { backgroundColor: '#2a2f45' }]}>
              <Text style={[styles.badgeText, { color }]}>
                {element}
              </Text>
            </View>
          </View>

          <Text numberOfLines={2} style={styles.bio}>
            {bio}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#101423',
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  characterImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  likeButton: {
    fontSize: 24,
  },
  rarity: {
    color: '#ffd166',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
  },
});