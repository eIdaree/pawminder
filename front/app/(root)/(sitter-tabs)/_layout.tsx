import React from 'react';
import { icons } from '../../../constants/index';
import { Tabs } from 'expo-router';
import { TabIcon } from '@/components/TabIcon';

const sitterTabs = [
	{ name: 'history', title: 'History', icon: icons.clock, label: 'History' },
	{ name: 'orders', title: 'Orders', icon: icons.messages, label: 'Orders' },
	{ name: 'profile', title: 'Profile', icon: icons.profile, label: 'Account' }
];
export default function Layout() {
	return (
		<Tabs
			initialRouteName='orders'
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
			{sitterTabs.map((tab) => (
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
