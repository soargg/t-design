
import React from 'react';
import { StyleSheet, View, Text } from 'react-native'
import { Carousel } from '../../components';
// react-native-snap-carousel

const horizontalMargin = 20;
const sliderWidth = 280;
const itemWidth = sliderWidth + horizontalMargin * 2;
const itemHeight = 200;

export class MyCarousel extends React.Component {
    state = {
        entries: [
            { title: "安徒生童话" },
            { title: "格林童话" },
            { title: "我的童话" },
            { title: "安徒生童话1" },
            { title: "格林童话1" },
            { title: "我的童话1" }
        ]
    }

    _renderItem(item: any) {
        return (
            <View style={styles.slide}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
        );
    }

    render() {
        return (
            <Carousel
                loop
                autoplay
                autoplayDelay={5000}
                data={this.state.entries}
                renderItem={this._renderItem}
                sliderWidth={414}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
            />
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        height: 200,
        borderRadius: 10,
        backgroundColor: '#992211'
    },
    title: {
        color: '#fff'
    }
})