import {
  Modal,
  View,
  StyleSheet,
} from 'react-native';

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export default function EmojiPicker({
  isVisible,
  children,
  onClose,
}: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  content: {
    backgroundColor: '#222',
    height: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});