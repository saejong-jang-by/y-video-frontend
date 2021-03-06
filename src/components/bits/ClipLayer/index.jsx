import React, { useState, useRef, useLayoutEffect } from 'react'

import { Rnd } from 'react-rnd'

import {
	Style,
} from './styles'

const ClipLayer = props => {

	const { width, start, end, setStart, setEnd, videoLength, active} = props
	const layerRef = useRef(null)

	const [initialWidth, setInitialWidth] = useState(0)
	const [shouldUpdate, setShouldUpdate] = useState(false)
	const [layerWidth, setLayerWidth] = useState(0)

	const style = active !== `` ? { left: `${start}% !important`, top: `0px`, backgroundColor:`rgba(255,255,0,0.5)`, borderLeft: `3px solid #000000`,borderRight:`3px solid #000000`} : {}

	if(shouldUpdate)
		setShouldUpdate(false)

	useLayoutEffect(() => {
		setInitialWidth(layerRef.current.offsetWidth)
		if(layerWidth === 0)
			setLayerWidth(layerRef.current.offsetWidth + width)
		else if (width === 0)
			setLayerWidth(initialWidth)
		else
			setLayerWidth(layerWidth + width)
	}, [width])

	if(document.getElementsByClassName(`total`)[0] !== undefined && layerWidth !== 0){
		document.getElementById(`time-bar-container`).style.width = `${layerWidth - 2}px`
		document.getElementsByClassName(`total`)[0].style.width = `${layerWidth - 2}px`
		document.getElementById(`layer-time-indicator`).style.width = `${layerWidth}px`
	}

	// This object is to tell the onReziseStop nevent for the Rnd component that resizing can only be right and left
	const Enable = {top:false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false}

	// Drag within the layer
	const handleDrag = (d) => {
		// const beginTimePercentage = d.x / layerWidth * videoLength
		// const endPercentage = beginTimePercentage + (end - start)

		const beginTimePercentage = d.x /layerWidth*100*videoLength/100
		const endPercentage = beginTimePercentage + (end - start)

		// LOGIC TO CHANGE THE TIME @params beginTime, end
		let s = beginTimePercentage
		let e = endPercentage

		if(e > videoLength)
			e = videoLength

		if(s < 0)
			s = 0
		// call handler from parent
		setStart(s)
		setEnd(e)
	}
	// Resize within the layer
	const handleResize = (direction, ref, delta, event, index, e ) => {
		let s = start
		let en = end
		const difference = delta.width / layerWidth * videoLength
		if(direction === `right`){
			en += difference

			if(en > videoLength)
				en = videoLength

		} else {
			s -= difference
			if(s < 0)
				s = 0
			else if(s > videoLength){
				s = videoLength-30
				en = videoLength
			}
		}

		setStart(s)
		setEnd(en)
	}

	return (
		<>
			<Style layerWidth={layerWidth} className='layer-container'>
				{/* overflow-x should be like scroll or something */}
				<div ref={layerRef} className='clipbox'>
					<div className={`clip-layer events`}>
						<Rnd
							id={`clip-start`}
							size={{width: `${(end - start)/videoLength * layerWidth}px`, height: `46px`}}
							position={{ x: parseFloat(start/videoLength * layerWidth), y: 0}}
							enableResizing={Enable}
							dragAxis='x'
							bounds={`.clip-layer`}
							onDrag={(e, d) => handleDrag(d)}
							onResizeStop={(e, direction, ref, delta, position) => handleResize(direction, ref, delta, e, position)}
							key={`clip`}
							// onClick={() => toggleEditor(layerIndex, index)}
							style={style}
						>
						</Rnd>
					</div>
				</div>
			</Style>
		</>
	)
}

export default ClipLayer

