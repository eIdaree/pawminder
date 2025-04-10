import { Modal, View, Text, Pressable } from 'react-native';

interface ICustomAlert{
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomAlert = ({ visible, onConfirm, onCancel }: ICustomAlert) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-xl w-80 shadow-lg">
          <Text className="text-lg font-semibold mb-4">Подтверждение</Text>
          <Text className="text-gray-600 mb-6">Вы уверены, что хотите добавить питомца?</Text>
          <View className="flex-row justify-end space-x-4">
            <Pressable onPress={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
              <Text className="text-gray-800">Отмена</Text>
            </Pressable>
            <Pressable onPress={onConfirm} className="px-4 py-2 bg-primary rounded-md">
              <Text className="text-white">Да</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
