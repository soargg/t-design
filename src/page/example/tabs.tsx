import React, { useState } from 'react';
import { View } from 'react-native';
import { Tabs, Checkbox, Radio, Shadow } from '../../components';


const tabOptions = [
    {tabkey: '1', tab: '桃子'},
    {tabkey: '2', tab: '香蕉'},
    {tabkey: '3', tab: '台湾凤梨'},
    {tabkey: '4', tab: '怀柔板栗'},
    {tabkey: '5', tab: '毒蘑菇'},
    {tabkey: '6', tab: '海螺'},
    {tabkey: '7', tab: '变异🐴'},
    {tabkey: '8', tab: '南瓜灯'}
]

export const TabsModule = () => {

    const [index, setIndex] = useState('2');
    const [scrollable, setScrollable] = useState(true);
    const [justify, setJustify] = useState('flex-start');
    const [level, setLevel] = useState(false);
    const [white, setWhite] = useState(false);

    return (
        <>
            <Shadow style={{
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowOpacity: 0.06,
                shadowColor: '#333333',
                shadowRadius: 2,
                backgroundColor: white ? '#111E36' : '#FFF'
            }}>
                <Tabs
                    transparent={white}
                    activeKey={index}
                    tabLevel={level ? 2 : 1}
                    justify={justify as any}
                    scrollable={scrollable}
                    defaultActiveKey="2"
                    options={scrollable ? tabOptions : tabOptions.slice(0, 3)}
                    onChange={key => {
                        setIndex(key as string)
                    }}
                />
            </Shadow>

            <View style={{ marginTop: 20 }}>
                <Checkbox checked={scrollable} onChange={(c) => { setScrollable(c) }}>可滚动</Checkbox>
                {
                    !scrollable ? 
                    <Radio.Group
                        defaultValue="flex-start"
                        options={[
                            {label: '居左', value: 'flex-start'},
                            {label: '居中', value: 'center', style: {marginLeft: 8}},
                            {label: '居右', value: 'flex-end', style: {marginLeft: 8}},
                            {label: '环绕对齐', value: 'space-around', style: {marginLeft: 8}},
                            {label: '两端对齐', value: 'space-between', style: {marginLeft: 8}},
                        ]}
                        onChange={(v) => {
                            setJustify(v as string)
                        }}
                    /> : null
                }
                <Checkbox checked={level} onChange={(c) => { setLevel(c) }}>二级导航</Checkbox>
                <Checkbox checked={white} onChange={(c) => { setWhite(c) }}>反白</Checkbox>
                {/* <View style={{flexDirection: 'row', marginTop: 5}}>
                    { scrollable ? <Button onPress={() => { setIndex('6') }}>go</Button> : null}
                </View> */}
            </View>
        </>
    )
}