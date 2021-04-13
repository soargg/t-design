/**
 * @component Alert
 * @description 警示弹窗组件，居中展现需要关注的信息
 *
 * - 类似浏览器原生API调用方式。
 * - 返回一个Promise实例对象，可通过then方法绑定确定按钮回调。
 *
 * @author liyeg
 * @Date 2020/06/17
 */
import Confirm from '../confirm';
/**
 * @method Alert
 * @param {String | Function | Object} option 为配置对象是，可以接受以下参数
 * @param { String | Function } [option.content] 组件显示的内容，支持字符串和 jsx（返回 jsx 的回调函数，`() => jsx`）
 * @param { String } [option.title] 组件展示的标题
 * @param { String } [option.btnText] 确认按钮的文本
 */
export default function Alert(content) {
    let title = '', btnText = '我知道了', btnStyle = null, btnTxtStyle = null, zIndex = 99;
    if (typeof content === 'object') {
        const opt = content;
        title = opt.title !== undefined ? opt.title : title;
        content = opt.content !== undefined ? opt.content : '';
        btnText = opt.btnText !== undefined ? opt.btnText : btnText;
        btnStyle = opt.btnStyle !== undefined ? opt.btnStyle : btnStyle;
        btnTxtStyle = opt.btnTxtStyle !== undefined ? opt.btnTxtStyle : btnTxtStyle;
        zIndex = ('zIndex' in opt) ? opt.zIndex : zIndex;
    }
    return Confirm({
        title,
        content,
        zIndex,
        cancel: false,
        btnText: [btnText, ''],
        btnStyles: [btnStyle, null],
        btnTxtStyles: [btnTxtStyle, null]
    });
}
