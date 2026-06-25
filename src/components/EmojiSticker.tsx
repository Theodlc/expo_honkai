import { Text } from 'react-native';

type Props = {
  emoji: string;
};

export default function EmojiSticker({
  emoji,
}: Props) {
  return (
    <Text
      style={{
        position: 'absolute',
        top: 50,
        fontSize: 60,
      }}
    >
      {emoji}
    </Text>
  );
}