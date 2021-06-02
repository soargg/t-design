/*
 *   {\__/}
 *   ( •-•)
 *   /つ 指示器
 * @author liyeg
 * @date 20210527
 */
import React from 'react';
import { ScrollView, View } from "react-native";
import Dot from './dot';
class Indicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCount: this.props.maxPage,
        };
    }
    static get displayName() { return 'Indicator'; }
    ;
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.maxPage !== prevState.totalCount) {
            return {
                totalCount: nextProps.maxPage
            };
        }
        return null;
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.maxPage != nextProps.maxPage) {
            return true;
        }
        if (this.props.curPage === nextProps.curPage) {
            return false;
        }
        return true;
    }
    componentDidUpdate(prevProps) {
        if (this.props.maxPage > 4 && prevProps.curPage !== this.props.curPage)
            this.scrollTo(this.props.curPage);
    }
    scrollTo(index, animated = true) {
        this.refs._scrollView.scrollTo({
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
            normalizedPage = maxPage - 1;
        }
        if (maxPage < 5) {
            return (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {dotList.map(i => {
                    return (<Dot key={i} idx={i} curPage={normalizedPage} maxPage={maxPage} activeColor={activeDotColor}/>);
                })}
                </View>);
        }
        const { containerWidth = 50, containerStyle = null } = this.props;
        return (<View style={[
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
                containerStyle
            ]} onLayout={() => {
                this.scrollTo(this.props.curPage, false);
            }}>
                <ScrollView ref="_scrollView" style={{
                maxWidth: containerWidth
            }} contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center'
            }} bounces={false} horizontal={true} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
                    {dotList.map(i => {
                return (<Dot key={i} idx={i} curPage={normalizedPage} maxPage={this.state.totalCount} activeColor={activeDotColor}/>);
            })}
                </ScrollView>
            </View>);
    }
}
export default Indicator;
