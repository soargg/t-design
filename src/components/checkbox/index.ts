/**
 * @component Checkbox
 * @description 复选框
 * 2021/04/16
 * @author liyeg
 *  */ 

import Checkbox from './Checkbox';
import CheckboxGroup from './Group';

class CheckboxExtra extends Checkbox {
    static get Group(): typeof CheckboxGroup { return CheckboxGroup; } 
}

export default CheckboxExtra;