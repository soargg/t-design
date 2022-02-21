import React from 'react';
import { Animated, View, StyleSheet, ViewStyle, StyleProp, ScrollView } from 'react-native';

type DotProps = {
    active: boolean;
    style?: StyleProp<ViewStyle>;
}

class Dot extends React.PureComponent<DotProps>{
    state: {
        aniVal: Animated.Value
    } = { aniVal: new Animated.Value(this.props.active ? 1 : 0)}

    componentDidUpdate(preProps: DotProps) {
        if (this.props.active !== preProps.active) {
            Animated.timing( this.state.aniVal, {
                toValue: this.props.active ? 1 : 0,
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    }

    render() {
        const { style } = this.props;

        return (
            <Animated.View
                style={[
                    {
                        height: 4,
                        width: this.state.aniVal.interpolate({
                            inputRange: [0, 1],
                            outputRange: [4, 12]
                        }),
                        borderRadius: 2,
                        backgroundColor: '#FFFFFF',
                        opacity: this.state.aniVal.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.6, 1]
                        })
                    },
                    style
                ]}
            />
        );
    }
}

export class ElasticDots extends React.PureComponent<{total: number, index: number}> {

    private scrollRef: ScrollView = null;

    componentDidMount() {
        this.scrollToCenter(false);
    }

    componentDidUpdate(preProps: {total: number, index: number}) {
        if (this.props.index !== preProps.index || preProps.total !== this.props.total) {
            this.scrollToCenter(Math.abs(this.props.index - preProps.index) === 1);
        }
    }

    private scrollToCenter(animated: boolean = true) {
        const {total, index} = this.props;
        if (total > 5 && this.scrollRef) {
            this.scrollRef.scrollTo({
                y: 0, x: (index - 2 > 0 ? index - 2 : 0) * 8, animated
            });
        }
    }

    render() {
        const {total=0, index} = this.props; 
        const dots = Array.from(Array(total).keys());

        if (total <= 5) {
            return (
                <View style={styles.wrap}>
                {
                    dots.map((idx => {
                        return <Dot key={idx} active={index === idx} style={{ marginRight: idx === total -1 ? 0 : 4 }}/>
                    }))
                }
                </View>
            );
        }

        return (
            <View style={styles.scrollWrap} pointerEvents="none">
                <ScrollView
                    style={{flex: 1, width: 44}}
                    bounces={false}
                    horizontal={true}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={s => { this.scrollRef = s; }}
                >
                    {
                        dots.map((idx => {
                            return <Dot key={idx} active={index === idx} style={{ marginRight: idx === total -1 ? 0 : 4 }}/>
                        }))
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    scrollWrap: {
        width: 44,
        overflow: 'hidden'
    }
});