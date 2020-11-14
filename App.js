/** @format */

import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	Image,
	Animated,
} from 'react-native';

const { width, height } = Dimensions.get('screen');

const images = {
	man:
		'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
	women:
		'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
	kids:
		'https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
	skullcandy:
		'https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
	help:
		'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
};
const data = Object.keys(images).map((i) => ({
	key: i,
	title: i,
	image: images[i],
}));

const Indicator = ({ scrollX, layoutTabs }) => {
	const inputRange = data.map((_, index) => width * index);
	const indicatorWidth = scrollX.interpolate({
		inputRange,
		outputRange: layoutTabs.map((tab) => tab.width),
	});
	const indicatorLeft = scrollX.interpolate({
		inputRange,
		outputRange: layoutTabs.map((tap) => tap.x - 12),
	});

	return (
		<Animated.View
			style={{
				position: 'absolute',
				bottom: -10,
				height: 5,
				width: indicatorWidth,
				backgroundColor: '#fff',
				transform: [
					{
						translateX: indicatorLeft,
					},
				],
			}}
		></Animated.View>
	);
};

const Tab = ({ item, onLayout, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			onLayout={onLayout}
			style={{
				backgroundColor: 'rgba(0,0,0,0.5)',
				paddingVertical: 10,
				paddingHorizontal: 5,
				borderRadius: 3,
			}}
		>
			<Text
				style={{
					fontSize: width / 25,
					fontWeight: 'bold',
					color: '#fff',
					textTransform: 'uppercase',
				}}
			>
				{item.title}
			</Text>
		</TouchableOpacity>
	);
};

const Tabs = ({ data, scrollX, onTabPress }) => {
	const layoutTabs = useRef([]).current;
	const [indicatorTab, setIndicatorTab] = useState([]);

	const handleLayoutChild = useCallback(
		(event) => {
			layoutTabs.push(event.nativeEvent.layout);

			if (layoutTabs.length === data.length) {
				setIndicatorTab(layoutTabs);
			}
		},
		[layoutTabs, setIndicatorTab]
	);

	return (
		<View
			style={{
				position: 'absolute',
				top: 30,
				width,
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				alignItems: 'center',
			}}
		>
			{data.map((item, index) => {
				return (
					<Tab
						key={item.key}
						item={item}
						onLayout={handleLayoutChild}
						onPress={() => onTabPress(index)}
					></Tab>
				);
			})}
			{indicatorTab && indicatorTab.length > 0 && (
				<Indicator
					scrollX={scrollX}
					layoutTabs={layoutTabs}
				></Indicator>
			)}
		</View>
	);
};

export default function App() {
	const flatList = useRef();
	const scrollX = useRef(new Animated.Value(0)).current;

	const handleTabPress = useCallback((index) => {
		flatList?.current?.scrollToIndex({
			index: index,
		});
	});

	return (
		<View style={styles.container}>
			<StatusBar hidden />
			<Animated.FlatList
				ref={flatList}
				data={data}
				keyExtractor={(item) => item.key}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									x: scrollX,
								},
							},
						},
					],
					{
						useNativeDriver: false,
					}
				)}
				scrollEventThrottle={16}
				horizontal
				bounces
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => {
					return (
						<View
							style={{
								width,
								height,
							}}
						>
							<Image
								source={{ uri: item.image }}
								style={{
									resizeMode: 'cover',
									flex: 1,
								}}
							></Image>
							<View
								style={[
									StyleSheet.absoluteFillObject,
									{ backgroundColor: 'rgba(0,0,0,.3)' },
								]}
							></View>
						</View>
					);
				}}
			></Animated.FlatList>
			<Tabs
				data={data}
				scrollX={scrollX}
				onTabPress={handleTabPress}
			></Tabs>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
