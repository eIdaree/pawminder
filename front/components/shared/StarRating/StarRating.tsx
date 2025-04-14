import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { icons } from '@/constants';

type Props = {
	rating: number;
};

export const StarRating: React.FC<Props> = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const partial = rating - fullStars;
	const maxStars = 5;

	return (
		<View className='flex-row items-center'>
			{Array.from({ length: maxStars }).map((_, i) => {
				if (i < fullStars) {
					// Полная звезда
					return (
						<Image
							key={i}
							source={icons.starFilled}
							style={styles.star}
							resizeMode='contain'
						/>
					);
				} else if (i === fullStars && partial > 0) {
					// Частично заполненная звезда
					return (
						<View key={i} style={styles.starContainer}>
							<Image
								source={icons.star}
								style={[styles.star, styles.absolute]}
								resizeMode='contain'
							/>
							<View
								style={[styles.partialFill, { width: `${partial * 100}%` }]}
							>
								<Image
									source={icons.starFilled}
									style={styles.star}
									resizeMode='contain'
								/>
							</View>
						</View>
					);
				} else {
					// Пустая звезда
					return (
						<Image
							key={i}
							source={icons.star}
							style={styles.star}
							resizeMode='contain'
						/>
					);
				}
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	star: {
		width: 16,
		height: 18,
		marginRight: 7
	},
	starContainer: {
		width: 16,
		height: 18,
		marginRight: 7,
		position: 'relative',
		overflow: 'hidden'
	},
	partialFill: {
		height: 18,
		position: 'absolute',
		left: 0,
		top: 0,
		overflow: 'hidden'
	},
	absolute: {
		position: 'absolute',
		left: 0,
		top: 0
	}
});

export default StarRating;
