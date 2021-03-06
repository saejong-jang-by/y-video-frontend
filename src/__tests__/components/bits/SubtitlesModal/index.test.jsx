import React from 'react'
import { shallow, mount } from 'enzyme'
import SubtitlesModal from '../../../../components/bits/SubtitlesModal'
import Style from '../../../../components/bits/SubtitlesModal/styles'
import { BrowserRouter } from 'react-router-dom'
import sinon from "sinon";


const props = {
	mode: 'create',
	visible: false,
	handleAddSubLayer: jest.fn(),
	setModalVisible: jest.fn(),
}

describe(`Subtitles Modal test`, () => {
	it(`mount`, () => {
		let wrapper = mount(
			<BrowserRouter>
				<SubtitlesModal {...props} />
			</BrowserRouter>
		)
		expect(wrapper.contains(<h1>Choose an Option</h1>)).toEqual(true)
		expect(wrapper.contains(<p>Start from scratch</p>)).toEqual(true)
	})

	it(`modalButton1 onClick`, ()=> {
		const mockCallBack = jest.fn();
		const button = shallow(<Style onClick={mockCallBack}/>);
		button.find('StyledComponent').simulate('click');
		expect(mockCallBack.mock.calls.length).toEqual(1);
	})

	it(`modalButton2 onClick`, ()=> {
		const mockCallBack = jest.fn();
		const imgButton = shallow(<img alt="close" className="closeModal" src="close_icon.svg" onClick={mockCallBack}/>);
		imgButton.find('img').simulate('click');
		expect(mockCallBack.mock.calls.length).toEqual(1);
	})

	it(`simulate onClick`, ()=> {
		const mockCallBack = jest.fn();
		const button = shallow(<div className="modalSection modalButton" onClick={mockCallBack}/>);
		button.find('div').simulate('click');
		expect(mockCallBack.mock.calls.length).toEqual(1);
	})

	it('simulate onClick', () => {
		const mockCallBack = jest.fn();
		const button = shallow(<button style={{margin:`10px`}} className="modalButton" onClick={mockCallBack}>Submit</button>);
		button.find('button').simulate('click');
		expect(mockCallBack.mock.calls.length).toEqual(1);
	});

	afterEach(() => {
    jest.resetAllMocks();
  });
	it('onClick createLayer.fromFile', () => {
		const mElement = { files: "file" };
    const file = document.getElementById = jest.fn().mockReturnValueOnce(mElement);
		const handleClick = sinon.spy();
		let wrapper = shallow(<SubtitlesModal handleAddSubLayerFromFile={handleClick} {...props}/>,{ attachTo: file });
		wrapper.find('.modalButton').at(1).prop('onClick')()
		expect(handleClick.calledOnce).toBe(true);
	});

	it('simulate onChange files', () => {
		const wrapper = mount(
			<BrowserRouter>
				<SubtitlesModal {...props} />
			</BrowserRouter>,
		)
		wrapper.find({"id" : `subFileInput`}).simulate('change', { target: { files: 'path' } });
		let checked = wrapper.find('[files="path"]').first();
		expect(checked).toBeDefined();
	});

	it(`simulate onClick`, ()=> {
		const wrapper = shallow(<SubtitlesModal {...props}/>);
		wrapper.find(".setModalVisible").simulate('click');
		wrapper.find(".closeModal").simulate('click');
		wrapper.find(".modalSection .modalButton").simulate('click');
	})

})