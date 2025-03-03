import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";

type ArticleCardProps = {
  title: string;
  author: string;
  date: string;
  imageUrl: ImageSourcePropType;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  author,
  date,
  imageUrl,
}) => {
  return (
    <View className="bg-gray-100 rounded-lg p-4 my-1">
        <View className="flex-row items-center justify-around gap-4">
        <Image source={imageUrl} className="w-10% h-32 rounded-lg mb-4" />
        <View>
            <Text className="w-3/4 text-xl font-PoppinsSemibold font-bold text-black">{title}</Text>
            <Text className=" w-3/4 text-sm font-PoppinsRegular text-gray-500">{`Author ${author} · ${date}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default ArticleCard;
