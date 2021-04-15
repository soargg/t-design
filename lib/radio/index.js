/**
 * @component Radio
 * @description 单选框
 * 2020/07/06
 * @author liyeg
 *  */
import Radio from './Radio';
import RadioGroup from './RadioGroup';
class RadioExtra extends Radio {
    static get Group() { return RadioGroup; }
}
export default RadioExtra;
