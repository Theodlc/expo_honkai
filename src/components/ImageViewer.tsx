import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

type Props = {
  selectedImage?: string;
};

export default function ImageViewer({ selectedImage }: Props) {
  const placeholder =
    'https://static.wikia.nocookie.net/houkai-star-rail/images/5/5d/Wallpaper_Acheron.png';

  const imageSource = selectedImage
    ? { uri: selectedImage }
    : { uri: placeholder };

  return (
    <Image
      source={imageSource}
      style={styles.image}
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 420,
    borderRadius: 16,
  },
});