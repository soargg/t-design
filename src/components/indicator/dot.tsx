/**
 *
 * Created by rouge on 11/09/2019.
 */
import React from "react";
import { Animated, View } from "react-native";

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



export default Dot;