import React from 'react';
import {shallow} from 'enzyme';
import Dialog from './Dialog';

describe('Dialog Component', ()=>{
    it('should display [message] passed with props', ()=>{
        const message = 'show this';

        const dialog = shallow(<Dialog message={message}/>);
        expect(dialog.find('.message').text()).toBe(message);
    })

    it('should send [id] when continue is clicked', ()=>{
        const message = 'show this';
        const id = 1;
        const onContinue = jest.fn();

        const props = {
            message,
            id,
            onContinue
        }

        const dialog = shallow(<Dialog {...props}/>);
        dialog.find('.btn').simulate('click');
        expect(onContinue).toHaveBeenCalledWith(id);
    })

    it('should render correctly', ()=>{
        const message = 'show this';
        const id = 1;

        const props = {
            message,
            id
        }

        const dialog = shallow(<Dialog {...props}/>);
        expect(dialog).toMatchSnapshot();
    })
})