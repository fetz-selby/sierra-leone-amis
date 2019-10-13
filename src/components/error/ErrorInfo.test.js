import React from 'react';
import {shallow} from 'enzyme';
import ErrorInfo from './';

describe('Network Error Component', ()=>{
    it('should display [message] passed with props', ()=>{
        const message = 'network is down';

        const error = shallow(<ErrorInfo message={message}/>);
        expect(error.find('.message').text()).toBe(message);
    })

    it('should call onCancel when cancel is clicked', ()=>{
        const message = 'network is down';
        const id = 1;
        const onCancel = jest.fn();

        const props = {
            message,
            onCancel
        }

        const error = shallow(<ErrorInfo {...props}/>);
        error.find('.btn-link').simulate('click');
        expect(onCancel).toHaveBeenCalled();
    })

    it('should render correctly', ()=>{
        const message = 'network is down';

        const props = {
            message
        }

        const error = shallow(<ErrorInfo {...props}/>);
        expect(error).toMatchSnapshot();
    })
})