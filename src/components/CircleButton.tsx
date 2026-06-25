import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  onPress?: () => void;
};

export default function CircleButton({ onPress }: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.plus}>
        +
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  plus: {
    color: '#fff',
    fontSize: 28,
  },
});