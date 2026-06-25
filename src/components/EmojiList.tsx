import {
  FlatList,
  Pressable,
  Text,
} from 'react-native';

const emojis = [
  '⭐',
  '⚔️',
  '💫',
  '🔥',
  '❄️',
  '🌙',
];

export default function EmojiList({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  return (
    <FlatList
      horizontal
      data={emojis}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
        >
          <Text
            style={{
              fontSize: 40,
              margin: 15,
            }}
          >
            {item}
          </Text>
        </Pressable>
      )}
    />
  );
}