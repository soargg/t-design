import React from 'react';
import { Animated, View, ScrollView, StyleProp, ViewStyle } from 'react-native';

const DotType = {
    ACTIVE: {
        size: 6,
        opacity: 1.0,
    },
    INACTIVE: {
        size: 5,
        opacity: 0.8,
    },
    MEDIUM: {
        size: 4,
        opacity: 0.6,
    },
    SMALL: {
        size: 0,
        opacity: 0,
    },
};

const getDotStyle = (idx: number, curPage: number, maxPage: number) => {
    let bigArr = [];
    let smallArr = [];
    if (maxPage < 5) {
        //五个
        return ( idx === curPage ) ? DotType.ACTIVE : DotType.INACTIVE;
    }
     if (curPage<1) {
        bigArr = [0,1];
        smallArr = [2,3,4];
    }else if (curPage>=maxPage-1) {
        bigArr = [maxPage-2,maxPage-1];
        smallArr = [maxPage-5,maxPage-4,maxPage-3]
    }else{
        bigArr = [curPage-1,curPage,curPage+1];
        if (curPage==1) {
            smallArr = [curPage+2,curPage+3];
        }else if (curPage==maxPage-2) {
            smallArr = [curPage-2,curPage-3];
        }else{
            smallArr = [curPage+2,curPage-2];
        }
    } 
    if (idx==curPage) {
        return DotType.ACTIVE;
    }
    if (bigArr.indexOf(idx)>=0) {
        return DotType.INACTIVE;
    } 
    if (smallArr.indexOf(idx)>=0) {
        return DotType.MEDIUM;
    }
    return DotType.SMALL;

};


type DotProps = {
    idx: number,
    curPage: number,
    maxPage: number,
    activeColor: string,
}
type DotState = {
    animVal: any,
    animate: boolean,
    prevType: any,
    type: any,
}

class Dot extends React.Component<DotProps, DotState> {
    constructor(props: DotProps) {
        super(props);

        const type = getDotStyle(props.idx, props.curPage, props.maxPage);
        this.state = {
            animVal: new Animated.Value(0),
            animate: false,
            prevType: type,
            type: type
        }
    }

    static getDerivedStateFromProps(nextProps: DotProps, prevState: DotState) {
        const nextType = getDotStyle(nextProps.idx, nextProps.curPage, nextProps.maxPage);
        const prevType = prevState.type;

        return {
            animate: (nextType.size !== prevType.size) || (nextType.opacity !== prevType.opacity),
            prevType: prevType,
            type: nextType
        }
    }

    componentDidUpdate() {
        if (this.state.animate === false) return;

        this.state.animVal.setValue(0);

        Animated.timing(
            this.state.animVal, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        },
        ).start();
    }


    render() {
        const { prevType, type } = this.state;

        const opacity = this.state.animVal.interpolate({
            inputRange: [0, 1],
            outputRange: [prevType.opacity, type.opacity]
        });

        const size = this.state.animVal.interpolate({
            inputRange: [0, 1],
            outputRange: [prevType.size, type.size]
        });

        const borderRadius = this.state.animVal.interpolate({
            inputRange: [0, 1],
            outputRange: [prevType.size * 0.5, type.size * 0.5]
        });

        const { activeColor } = this.props;
        return (
            <View style={{
                width: 10, height: 8, alignItems: 'center',
                justifyContent: 'center',
                //  borderWidth: 1, borderColor: 'green'
            }}>
                <Animated.View
                    style={[{
                        backgroundColor: activeColor,
                    }, {
                        width: size,
                        height: size,
                        borderRadius: borderRadius,
                        opacity: opacity,
                    }]} />
            </View>
        )
    }
}

type ScaleDotsProps = {
    curPage: number;
    maxPage: number;
    activeDotColor: string;
    containerStyle?: StyleProp<ViewStyle>;
    containerWidth?: number;
}

export class ScaleDots extends React.Component<ScaleDotsProps> {
    static get displayName() { return 'Indicator' };

    state: {
        totalCount: number,
    }

    constructor(props: ScaleDotsProps) {
        super(props);
        this.state = {
            totalCount: this.props.maxPage,
        };
    }

    static getDerivedStateFromProps(nextProps: ScaleDotsProps, prevState: {totalCount: number}) {
        if (nextProps.maxPage !== prevState.totalCount) {
            return {
                totalCount: nextProps.maxPage
            }
        }

        return null;
    }

    shouldComponentUpdate(nextProps: ScaleDotsProps) {
        if (this.props.maxPage != nextProps.maxPage) {
            return true;
        }
        if (this.props.curPage === nextProps.curPage) {
            return false;
        }

        return true;
    }

    componentDidUpdate(prevProps: ScaleDotsProps) {
        if (this.props.maxPage > 4 && prevProps.curPage !== this.props.curPage)
            this.scrollTo(this.props.curPage)
    }

    scrollTo(index: number, animated = true) {

        (this.refs._scrollView as any).scrollTo({
            x: Math.max(0, 18 + (index - 4) * 10),
            animated,
        });
    }

    render() {
        const { curPage, activeDotColor } = this.props;
        const dotList = [...Array(this.state.totalCount).keys()];
        let maxPage = this.state.totalCount;

        let normalizedPage = curPage;
        if (curPage < 0) {
            normalizedPage = 0;
        }

        if (curPage > maxPage - 1) {
            normalizedPage = maxPage - 1
        }

        if (maxPage < 5) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        dotList.map(i => {
                            return (
                                <Dot
                                    key={i}
                                    idx={i}
                                    curPage={normalizedPage}
                                    maxPage={maxPage}
                                    activeColor={activeDotColor}
                                />
                            );
                        })}
                </View>
            )
        }

        const { containerWidth = 50, containerStyle=null } = this.props;

        return (

            <View
                style={[
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
                    containerStyle
                ]}
                onLayout={() => {
                    this.scrollTo(this.props.curPage, false);
                }}
            >
                <ScrollView
                    ref="_scrollView"
                    style={{
                        maxWidth: containerWidth
                    }}
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    bounces={false}
                    horizontal={true}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        dotList.map(i => {
                            return (
                                <Dot
                                    key={i}
                                    idx={i}
                                    curPage={normalizedPage}
                                    maxPage={this.state.totalCount}
                                    activeColor={activeDotColor}
                                />
                            );
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}