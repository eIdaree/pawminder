import React from 'react';
import { icons } from '../../../constants/index';
import { Tabs } from 'expo-router';
import { TabIcon } from '@/components/TabIcon';

const userTabs = [
	{ name: 'sitters', title: 'Sitter', icon: icons.messages, label: 'Sitter' },
	{ name: 'home', title: 'Home', icon: icons.home, label: 'Home' },
	{ name: 'pets1', title: 'Pets', icon: icons.pet, label: 'Pet' },
	{ name: 'profile', title: 'Profile', icon: icons.profile, label: 'Account' }
];

export default function Layout() {
	return (
		<Tabs
			initialRouteName='home'
			screenOptions={{
				tabBarActiveTintColor: '#333333',
				tabBarInactiveTintColor: 'gray',
				tabBarShowLabel: false,
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '',
					borderTopWidth: 0,
					shadowColor: '#000',
					shadowOpacity: 0.1,
					shadowOffset: { width: 0, height: -2 },
					paddingVertical: 10,
					elevation: 0,
					height: 70
				}
			}}
		>
			{userTabs.map((tab) => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{
						title: tab.title,
						headerShown: false,
						tabBarIcon: ({ focused }) => (
							<TabIcon source={tab.icon} label={tab.label} focused={focused} />
						)
					}}
				/>
			))}
		</Tabs>
	);
}
