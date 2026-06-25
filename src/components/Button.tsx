import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function Button({ label, onPress }: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    width: 220,
  },

  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});