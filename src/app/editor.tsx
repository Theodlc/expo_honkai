import { useRef, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { View } from 'react-native';

import { captureRef } from 'react-native-view-shot';

import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import EmojiList from '../components/EmojiList';
import EmojiPicker from '../components/EmojiPicker';
import EmojiSticker from '../components/EmojiSticker';
import ImageViewer from '../components/ImageViewer';

export default function Editor() {
  const [selectedImage, setSelectedImage] =
    useState<string>();

  const [emoji, setEmoji] =
    useState<string>();

  const [pickerVisible, setPickerVisible] =
    useState(false);

  const imageRef = useRef<View>(null);

  async function pickImage() {
    const result =
      await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setSelectedImage(
        result.assets[0].uri
      );
    }
  }

  async function saveImage() {
    const permission =
      await MediaLibrary.requestPermissionsAsync();

    if (!permission.granted)
      return;

    const uri = await captureRef(
      imageRef,
      {
        quality: 1,
        format: 'png',
      }
    );

    await MediaLibrary.saveToLibraryAsync(
      uri
    );

    alert('Imagem salva!');
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
      }}
    >
      <View ref={imageRef}>
        <ImageViewer
          selectedImage={selectedImage}
        />

        {emoji && (
          <EmojiSticker
            emoji={emoji}
          />
        )}
      </View>

      <Button
        label="Escolher Imagem"
        onPress={pickImage}
      />

      <Button
        label="Salvar"
        onPress={saveImage}
      />

      <CircleButton
        onPress={() =>
          setPickerVisible(true)
        }
      />

      <EmojiPicker
        isVisible={pickerVisible}
        onClose={() =>
          setPickerVisible(false)
        }
      >
        <EmojiList
          onSelect={(item) => {
            setEmoji(item);
            setPickerVisible(false);
          }}
        />
      </EmojiPicker>
    </View>
  );
}