import { mount, shallowMount } from '@vue/test-utils'

export function initComponent(component, propsData, isMount) {
    const initFunction = (isMount === true ? mount : shallowMount);
    const props = {
        propsData: {
            ...propsData
        }
    };
    return initFunction.call(this, component, props);
}

export function destroy(wrapper) {
    if (wrapper && wrapper.destroy) {
        wrapper.destroy();
    }
}