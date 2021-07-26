import React, { useState, useEffect, useRef } from 'react'

import { Prompt } from 'react-router'

import Style, { Timeline, EventList, AnnotationMessage, Icon } from './styles'

import { DndProvider } from 'react-dnd'
import { Rnd } from 'react-rnd'
import Backend from 'react-dnd-html5-backend'
import * as Subtitle from 'subtitle'
import { SubtitleEditorSideMenu, SubtitlesCard, SubtitlesLayer } from 'components/bits'
import { Controller } from 'components'
import { SubtitlesModal } from 'components/bits'

import trashIcon from 'assets/trash_icon.svg'
import editIcon from 'assets/ca_tracks_edit.svg'
import saveIcon from 'assets/check.svg'

import closeIcon from 'assets/close_icon.svg'
import zoomIn from 'assets/te-zoom-in.svg'
import zoomOut from 'assets/te-zoom-out.svg'
import llIcon from 'assets/te-chevrons-left.svg'
import rrIcon from 'assets/te-chevrons-right.svg'
import lIcon from 'assets/te-chevron-left.svg'
import rIcon from 'assets/te-chevron-right.svg'
import captions from 'assets/captions.svg'
import helpIcon from 'assets/te-help-circle-white.svg'

// ICONS FOR THE EVENTS CAN BE FOUND AT https://feathericons.com/
// TRASH ICON COLOR IS: #eb6e79. OTHER ICON STROKES ARE LIGHT BLUE VAR IN CSS: #0582ca

const SubtitleEditor = props => {

	// console.log('%c Editor Component', 'color: red; font-weight: bolder; font-size: 12px;')

	const { setEvents, updateContent, createSub,setAllSubs,activeUpdate, deleteSubtitles } = props

	const {
		eventsArray,
		currentContent,
		subs,
		contentError,
		subtitleError,
	} = props.viewstate

	const { handleShowTip, toggleTip, handleShowHelp } = props.handlers

	const testingSubtitle = `1\n00:00:00,000 --> 00:00:20,500\nThis is a test\n\n2\n00:00:40,500 --> 00:01:20,700\nThis is another test`
	const parseSub = Subtitle.parse(testingSubtitle)
	for (let i = 0; i < parseSub.length; i++){
		parseSub[i].start = parseSub[i].start/1000
		parseSub[i].end = parseSub[i].end/1000
	}
	const [allEvents, setAllEvents] = useState(eventsArray)
	const [layers, setLayers] = useState([])
	const [shouldUpdate, setShouldUpdate] = useState(false)
	const [blockLeave, setBlock] = useState(false)
	const [showSideEditor, setSideEditor] = useState(false)
	const [eventToEdit, setEventToEdit] = useState(10000)
	const [displayLayer, setDisplayLayer] = useState(0)
	const [videoLength, setVideoLength] = useState(0)
	const [videoCurrentTime, setCurrentTime] = useState(0)

	const [tab, setTab] = useState(`events`)
	const [timelineMinimized, setTimelineMinimized] = useState(false)
	const [eventListMinimized, setEventListMinimized] = useState(false)
	const [layerWidth, setWidth] = useState(0)
	const [zoomFactor, setZoomFactor] = useState(0)
	const [scrollWidth, setScrollWidth] = useState(0)
	const [annotationsSaved, setSaved] = useState(false)
	const [scrollBarWidth, setScrollBar] = useState(0)
	const [subtitles, setSubs] = useState(subs)
	const [subToEdit, setSubToEdit] = useState(0)
	const [subLayerToEdit, setSubLayerToEdit] = useState(0)
	const [subSelected, setSubSelected] = useState(false)
	const [subLayersToDelete, setSubLayersToDelete] = useState([])
	const [subModalVisible, setSubModalVisible] = useState(false)
	const [subModalMode, setSubModalMode] = useState(``)
	const [subChanges, setSubChanges] = useState(0)
	const [editCensor, setEditCensor] = useState({})
	const [dimensions, setDimensions] = useState({
		height: window.innerHeight,
		width: window.innerWidth,
	})
	const [activeCensorPosition,setActiveCensorPosition] = useState(-1)
	const [isLoading,setIsLoading] = useState(false)
	const [focus, setFocus] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [disablePlus, setDisablePlus] = useState(false)

	// refs
	const controllerRef = useRef(null)

	useEffect(() => {
		setScrollWidth(document.getElementsByClassName(`zoom-scroll-container`)[0].clientWidth)
		function handleResize() {
			setZoomFactor(0)
			setWidth(0)
			setTimeout(() => {
				setDimensions({
					height: window.innerHeight,
					width: window.innerWidth,
				})
			}, 500)
			setZoomFactor(1)
			setWidth(1)
		}
		window.addEventListener(`resize`, handleResize)
		setAllEvents(eventsArray)

		let largestLayer = 0

		// SORTING THE ARRAYS TO HAVE A BETTER WAY TO HANDLE THE EVENTS
		if(eventsArray !== undefined && eventsArray.length > 0){
			eventsArray.sort((a, b) => a.layer > b.layer ? 1 : -1)
			largestLayer = eventsArray[eventsArray.length-1].layer
		}

		// Find the largets layer number
		const initialLayers = []

		for(let i = 0; i < largestLayer + 1; i++)
			initialLayers.push([i])

		setLayers(initialLayers)
		setEvents(allEvents)

		if(blockLeave)
			window.onbeforeunload = () => true
		else
			window.onbeforeunload = undefined

		return () => {
			window.onbeforeunload = undefined
		}

	}, [eventsArray, blockLeave, isEdit])

	// end of useEffect

	if(shouldUpdate === true)

		setShouldUpdate(false)

	const togglendTimeline = () => {

		setTimelineMinimized(!timelineMinimized)
	}

	const getVideoDuration = (duration) => {
		setVideoLength(duration)
		const tempSubs = subs
		for (let i = 0; i < tempSubs.length; i++){
			try {
				tempSubs[i][`content`] = JSON.parse(tempSubs[i][`content`])
			} catch (e){
				tempSubs[i][`content`] = []
			}
		}

		setSubs(tempSubs)
		setAllSubs(tempSubs)
	}

	const deleteSub = (index) =>{
		const currentSubs = [...subtitles]
		currentSubs[subLayerToEdit][`content`].splice(index,1)
		setSubs(currentSubs)
		setAllSubs(currentSubs)

		if(currentSubs[subLayerToEdit][`content`].length === 0 || currentSubs[subLayerToEdit][`content`].length === 1)
			setSubToEdit(0)
		else if(currentSubs[subLayerToEdit][`content`].length === index)
			setSubToEdit(index-1)
		else
			setSubToEdit(index)

		setBlock(true)
	}

	// THIS IS PART OF CENSOR
	const handleLastClick = (height, width, x, y, time) => {
		// console.log(height, width)

		if(eventToEdit < allEvents.length && allEvents[eventToEdit].type === `Censor`){
			// console.log('%c Added position', 'color: red; font-weight: bold; font-size: 1.2rem;')
			const index = eventToEdit
			const cEvent = allEvents[index]

			if(cEvent.position[`${time.toFixed(1)}`] !== undefined)
				cEvent.position[`${time.toFixed(1)}`] = [x / width * 100, (y-86) / height * 100, cEvent.position[`${time.toFixed(1)}`][2], cEvent.position[`${time.toFixed(1)}`][3]]
			else
				cEvent.position[`${time.toFixed(1)}`] = [x / width * 100, (y-86) / height * 100, 30, 40]
		}
	}

	const openSubEditor = (layerIndex,subIndex) =>{
		setSubToEdit(subIndex)
		setSubLayerToEdit(layerIndex)
		activeUpdate(layerIndex)
		setSideEditor(true)
	}

	const closeSideEditor = () => {
		setSideEditor(false)
		setActiveCensorPosition(-1)
	}

	const handleSaveAnnotation = async () => {
		setIsLoading(true)
		const content = currentContent
		content.settings.annotationDocument = [...allEvents]
		await updateContent(content)
		await handleSaveSubtitles()
		deleteSubtitles(subLayersToDelete)
		setSubLayersToDelete([])
		setIsLoading(false)
		setBlock(false)
	}

	const handleSaveSubtitles = async() => {
		const rawSubs = subtitles
		createSub(rawSubs)
	}
	const handleZoomChange = (e, d) => {
		toggleTip()
		if(d.x < zoomFactor){
			if(d.x === 0){
				setZoomFactor(0)
				setWidth(0)
				handleScrollFactor(`start`)
			} else {
				setZoomFactor(d.x)
				setWidth(-(Math.abs(zoomFactor - d.x) * videoLength / 10))
			}
		} else if(d.x > zoomFactor) {
			setZoomFactor(d.x)
			setWidth(Math.abs(zoomFactor - d.x) * videoLength / 10)
		}
		setScrollBar(document.getElementsByClassName(`layer-container`)[0].clientWidth * 100 / document.getElementsByClassName(`events`)[0].clientWidth)
	}

	const handleScrollFactor = (direction) => {
		if(document.getElementsByClassName(`layer-container`) !== undefined){
			const scrubber = document.getElementById(`time-bar`)
			const timeIndicator = document.getElementById(`time-indicator-container`)
			const alllayers = Array.from(document.getElementsByClassName(`layer-container`))
			const currentLayerWidth = document.getElementsByClassName(`events`)[0].clientWidth
			const scrollBarContainer = document.getElementsByClassName(`zoom-scroll-container`)[0].offsetWidth
			const scrollBar = document.getElementsByClassName(`zoom-scroll-indicator`)[0]

			const cLeft = parseInt(scrollBar.style.left)
			const scrollBarOffset = scrollBarContainer * 0.03
			const lastPossibleRight = document.getElementsByClassName(`zoom-scroll-container`)[0].clientWidth - document.getElementsByClassName(`zoom-scroll-indicator`)[0].clientWidth

			switch (direction) {
			case `start`:
				scrubber.scrollLeft = 0
				timeIndicator.scrollLeft = 0
				alllayers.forEach((element, i) => {
					alllayers[i].scrollLeft = 0
				})
				scrollBar.style.left = `0px`

				break
			case `left`:
				scrubber.scrollLeft -= currentLayerWidth * 0.03
				timeIndicator.scrollLeft -= currentLayerWidth * 0.03
				alllayers.forEach((element, i) => {
					alllayers[i].scrollLeft -= currentLayerWidth * 0.03
				})
				// FIND 3 PERCENT OF PARENT
				// CURRENT LEFT MINUS NEW LEFT
				if(isNaN(cLeft) === false && cLeft - scrollBarOffset > -1)
					scrollBar.style.left = `${cLeft - scrollBarOffset}px`
				else if (cLeft - scrollBarOffset < 0)
					scrollBar.style.left = `0px`

				break
			case `right`:
				scrubber.scrollLeft += currentLayerWidth * 0.03
				timeIndicator.scrollLeft += currentLayerWidth * 0.03
				alllayers.forEach((element, i) => {
					alllayers[i].scrollLeft += currentLayerWidth * 0.03
				})
				if(zoomFactor !== 0){
					if(isNaN(cLeft) === true)
						scrollBar.style.left = `${scrollBarOffset}px`
					else
						scrollBar.style.left = `${cLeft + scrollBarOffset}px`

				}

				if (cLeft + scrollBarOffset > lastPossibleRight)
					scrollBar.style.left = `${scrollBarContainer - scrollBar.clientWidth}px`

				break
			case `end`:
				scrubber.scrollLeft += currentLayerWidth
				timeIndicator.scrollLeft += currentLayerWidth
				alllayers.forEach((element, i) => {
					alllayers[i].scrollLeft += currentLayerWidth
				})
				scrollBar.style.left = `${scrollBarContainer - scrollBar.clientWidth}px`

				break

			default:
				break
			}
		}
	}
	const updateSubs = (index, sub, subLayerIndex) => {
		let isOverlap = false
		let canAccessDom = false
		const tempSubs = [...subtitles]
		const currentSubs = tempSubs[subLayerIndex]
		const targetSubs = [...subtitles]
		let isError = false

		// console.log(targetSubs[subLayerIndex][`content`][index].start)
		// console.log(index)
		if(showSideEditor && eventListMinimized === false)
			canAccessDom = true
			// document.getElementById(`sideTabMessage`).style.color=`red`

		// check start event times
		if(sub.start < 0)
			sub.start = 0
			// if(canAccessDom)
		// document.getElementById(`sideTabExplanation`).innerText=`Changed start time to 0`

		else if(sub.start >= 100) {
			// sub.start = 95
			// sub.end = 100
			// if(canAccessDom)
			// document.getElementById(`sideTabExplanation`).innerHTML=`Start time cannot be larger than videoLength:${videoLength} <br/> Changed values to match criteria`
		}
		// console.log(targetSubs[subLayerIndex][`content`][index].start)

		if(index !== targetSubs[subLayerIndex][`content`].length-1){
			const curStart = targetSubs[subLayerIndex][`content`][index].start
			const nextStart = targetSubs[subLayerIndex][`content`][index+1].start
			// console.log(curStart)
			// console.log(nextStart)
			if(curStart > nextStart){
				// document.getElementById(`sideTabExplanation`).innerText=`Invalid input`
				console.log(`Invalid input`)
				isError = true
			}
		}

		// check end event times
		if(sub.end <= sub.start && isError===false){
			if(canAccessDom){
				// document.getElementsByClassName(`sideTabInput`)[1].value=sub.end
				// document.getElementById(`sideTabMessage`).innerHTML=`Please, enter a number bigger than start time`
				// document.getElementById(`subEnd`).style.border=`2px solid red`
				// document.getElementById(`subStartEnd`).style.border=``
				// document.getElementById(`sideTabExplanation`).innerHTML=``

				isOverlap = true
			}
		} else if(sub.end > 100){
			// event.end = 100
			// if(canAccessDom)
			// document.getElementById(`sideTabExplanation`).innerHTML=`End time cannot be larger than videoLength:${videoLength} <br/> Change value to ${videoLength} or less`
		}
		if(index !== targetSubs[subLayerIndex][`content`].length-1){
			const curStart = targetSubs[subLayerIndex][`content`][index].end
			const nextStart = targetSubs[subLayerIndex][`content`][index+1].start
			// console.log(curStart)
			// console.log(nextStart)
			if(curStart > nextStart){
				// document.getElementById(`sideTabExplanation`).innerText=`Invalid input`
				console.log(`Invalid input`)
				isError = true
			}
		}

		// if(targetSubs[subLayerIndex][`content`][index].end > targetSubs[subLayerIndex][`content`][index+1].start){
		// 	document.getElementById(`sideTabExplanation`).innerText=`Invalid input`
		// }

		// const tempSubs = [...subtitles]
		// const currentSubs = tempSubs[subLayerIndex]
		currentSubs[`content`][index] = sub
		tempSubs[subLayerIndex] = currentSubs

		setSubs(tempSubs)
		setAllSubs(tempSubs)
		setSubChanges(subChanges+1)
		setSubToEdit(index)
		setSubLayerToEdit(subLayerIndex)
		activeUpdate(subLayerIndex)
		setSubSelected(true)

		// check if time overlaps
		const subContent = [...subtitles[subLayerIndex][`content`]]

		if (subContent.length !== 1 && isOverlap===false) {
			subContent.sort((a,b)=> a.start - b.start)

			for (let i = 0; i < subContent.length - 1; i++) {
				const currentEndTime = subContent[i].end
				const nextStartTime = subContent[i + 1].start

				if (currentEndTime > nextStartTime) {
					isOverlap = true
					// document.getElementById(`sideTabExplanation`).innerHTML=`The time is overlapped`
					// document.getElementById(`sideTabExplanation`).style.color=`red`
					// document.getElementById(`subStartEnd`).style.border=`2px solid red`
					break
				}
			}
		}

		if(isOverlap === false) {
			if(sub.start >= 0 && sub.start < sub.end && sub.end <= 100){
				if(canAccessDom){
					// document.getElementById(`subStartEnd`).style.border=``
					// document.getElementById(`sideTabMessage`).innerHTML=``
					// document.getElementById(`sideTabExplanation`).innerHTML=``
					// document.getElementById(`subEnd`).style.border=``
					// sortSubtitles(subLayerIndex, index)
				}
			}
		}

		setBlock(true)
	}
	const addSubToLayer = (index, subIndex, position) => {
		// TODO: Change this to use real JS event objects and insert based on time
		const currentSubs = [...subtitles]
		let newSub = {}
		let subStart = 0
		let subEnd = 0
		let isError = false
		const addingTime = 2/videoLength*100

		try{
			if(currentSubs[index][`content`].length ===0){
				newSub = {
					start: 0,
					end: addingTime,
					text: ``,
				}

				currentSubs[index][`content`].push(newSub)
				// openSubEditor(index, subIndex)
				setSubToEdit(0)
			} else {
				if(position === `top`) {
					if(currentSubs[index][`content`][subIndex].start <= 0) {
						console.log(`Unable to add when the start is 0`)
						isError = true
					} else if(currentSubs[index][`content`][subIndex].start <= 2/videoLength*100) {
						subStart = 0
						subEnd = currentSubs[index][`content`][subIndex].start - 0.01
					} else {
						subStart = currentSubs[index][`content`][subIndex].start - addingTime
						subEnd = currentSubs[index][`content`][subIndex].start - 0.01
					}
					newSub = {
						start: subStart,
						end: subEnd,
						text: ``,
					}
					if(!isError) {
						setSubToEdit(0)
						currentSubs[index][`content`].unshift(newSub)
					}

				} else {
					if(subIndex !== currentSubs[index][`content`].length-1) {
						const curEndTime = currentSubs[index][`content`][subIndex].end
						const preStartTime = currentSubs[index][`content`][subIndex+1].start-0.01

						// console.log(curEndTime)
						// console.log(preStartTime)

						if(curEndTime === preStartTime || curEndTime === preStartTime+0.01) {
							console.log(`Unable to add time between`)
							isError = true
						} else if(preStartTime-curEndTime > addingTime){
							subStart = currentSubs[index][`content`][subIndex].end + .01
							subEnd = currentSubs[index][`content`][subIndex].end + .01 + addingTime
						} else {
							subStart = currentSubs[index][`content`][subIndex].end + .01
							subEnd = currentSubs[index][`content`][subIndex+1].start - .01
						}
						newSub = {
							start: subStart,
							end: subEnd,
							text: ``,
						}
						if(!isError) {
							// setSubToEdit(subIndex+2)
							currentSubs[index][`content`].splice(subIndex+1, 0, newSub)
						}
					} else {
						const curEndTime = currentSubs[index][`content`][subIndex].end
						// console.log(curEndTime)

						if(curEndTime === 100 || curEndTime === 100.01){
							console.log(`Unable to add time because the time reach the video length`)
							isError = true
						} else if(curEndTime+addingTime>100){
							subStart = currentSubs[index][`content`][subIndex].end + .01
							subEnd = 100
						} else {
							subStart = currentSubs[index][`content`][subIndex].end + .01
							subEnd = currentSubs[index][`content`][subIndex].end + .01 + addingTime
						}

						newSub = {
							start: subStart,
							end: subEnd,
							text: ``,
						}
						if(!isError) {
							setSubToEdit(subIndex+1)
							currentSubs[index][`content`].push(newSub)
						}
					}
				}
			}

			setSubLayerToEdit(index)
			activeUpdate(index)
			setSubs(currentSubs)
			setAllSubs(currentSubs)
			setSubToEdit(subToEdit+1)
			// openSubEditor(index, null)
			setBlock(true)
		}catch(error) {
			alert(`there was an error adding the subtitle`)
			console.error(error)
		}

	}

	const handleAddSubLayer = () => {
		if (subtitles === [] || !subtitles){
			const tempSubList = []
			const tempSub = {
				title : ``,
				language: ``,
				content: [{start: 0, end: 2/videoLength*100, text: ``}],
				id: ``,
			}
			tempSubList.push(tempSub)
			setSubs(tempSubList)
			setAllSubs(tempSubList)
			setDisablePlus(true)
		}else {
			const tempSubList = [...subtitles]
			const tempSub = {
				title : ``,
				language: ``,
				content: [{start: 0, end: 2/videoLength*100, text: ``}],
				id: ``,
			}
			tempSubList.push(tempSub)
			setSubs(tempSubList)
			setAllSubs(tempSubList)
		}
		openSubEditor(subtitles.length, 0)
		setSideEditor(true)
		setSubModalVisible(false)
		setSubModalMode(``)
		setBlock(true)
	}
	const handleAddSubLayerFromFile = (url) => {
		try{
			const reader = new FileReader()
			reader.onload = (e) =>{
				const temp = Subtitle.parse(e.target.result)
				for (let i = 0; i < temp.length; i++){
					temp[i].start = temp[i].start /1000/videoLength * 100
					temp[i].end = temp[i].end /1000/videoLength * 100
				}
				let removeArray = 0
				const filtered = temp.filter(item => {
					removeArray = removeArray + 1
					return item.start < 100
				})
				const filtered1 = filtered.filter(item => {
					removeArray = removeArray + 1
					return item.end < 100
				})
				if (removeArray > 0)
					alert(`Some subtitles had to be cut because the subtitles are longer than the video`)
				if (subtitles === [] || !subtitles){
					const tempSubList = []
					const tempSub = {
						title : ``,
						language: ``,
						content: filtered1,
						id: ``,
						type: ``,
					}
					tempSubList.push(tempSub)
					setSubs(tempSubList)
					setAllSubs(tempSubList)
				}else {
					const tempSubList = [...subtitles]
					const tempSub = {
						title : ``,
						language: ``,
						content: filtered1,
						id: ``,
						type: ``,
					}
					tempSubList.push(tempSub)
					setSubs(tempSubList)
					setAllSubs(tempSubList)

				}
				setSideEditor(false)
				setSubModalVisible(false)
				setSubModalMode(``)
			}
			reader.readAsText(url)
		}catch(error){
			console.log(error)
			alert(`There was an error importing subtitles`)
		}
		setSubModalVisible(false)
		setSubModalMode(``)
	}
	const handleDeleteSubLayer = (index) =>{
		if (index === subLayerToEdit)
			closeSideEditor()

		const tempSubs = [...subtitles]
		if (tempSubs[index][`id`] !== `` && tempSubs[index][`id`] !== undefined){
			const deleteSub = subLayersToDelete
			deleteSub.push(tempSubs[index][`id`])
			setSubLayersToDelete(deleteSub)
		}
		tempSubs.splice(index, 1)
		setSubs(tempSubs)
		setAllSubs(tempSubs)
		// setSubLayerToEdit(0)
		setBlock(true)
	}
	const updateSubLayerTitle = (title) =>{
		const temp = [...subtitles]
		temp[subLayerToEdit][`title`] = title
		setSubs(temp)
		setAllSubs(temp)
		setBlock(true)
	}
	const updateSubLayerLanguage = (language) =>{
		const temp = [...subtitles]
		temp[subLayerToEdit][`language`] = language
		setSubs(temp)
		setAllSubs(temp)
		setBlock(true)
	}
	const sortSubtitles = (subLayerIndex, currentSubInd) => {
		const tempSubs = [...subtitles]
		const tempContent = tempSubs[subLayerIndex][`content`]

		const start = tempContent[currentSubInd].start
		tempContent.sort((a,b)=> a.start - b.start)
		tempSubs[subLayerIndex][`content`] = tempContent

		for(let i = 0; i< tempContent.length; i++){
			if(tempContent[i].start === start) {
				if(i!==currentSubInd)
					setFocus(true)

				setSubToEdit(i)
				break
			}
		}

		setSubs(tempSubs)
		setAllSubs(tempSubs)
		setBlock(true)
	}
	const checkSub = () => {
		// if(subs[subLayerToEdit] !== undefined)
		// 	return subtitles[subLayerToEdit][`content`][subToEdit]
		// else
		// 	return []
		// return subtitles[0][`content`][0]
		return subtitles[subLayerToEdit][`content`][subToEdit]

	}
	const handleChangeSubIndex = (index,subLayer) =>{
		setSubToEdit(index)
		setFocus(false)
	}

	const handleEditSubTitle = (index) => {
		setIsEdit(true)
		setSubLayerToEdit(index)
	}

	const handleFocus = (index) => {
		setSubLayerToEdit(index)
		openSubEditor(index, 0)
	}

	return (
		<Style>
			<DndProvider backend={Backend}>
				<SubtitlesModal
					mode = {subModalMode}
					handleAddSubLayer = {handleAddSubLayer}
					handleAddSubLayerFromFile = {handleAddSubLayerFromFile}
					visible = {subModalVisible}
					setModalVisible = {setSubModalVisible}
				/>
				<span style={{ zIndex: 0 }}>

					<Controller ref = {controllerRef}
						className='video'
						url={props.viewstate.url}
						handlers={togglendTimeline}
						getDuration={getVideoDuration}
						getVideoTime={setCurrentTime}
						minimized={timelineMinimized}
						togglendTimeline={togglendTimeline}
						handleLastClick = {handleLastClick}
						events = {allEvents}
						eventToEdit={eventToEdit}
						activeCensorPosition = {activeCensorPosition}
						setActiveCensorPosition = {setActiveCensorPosition}
					>
					</Controller>
					<Timeline minimized={timelineMinimized} zoom={scrollBarWidth}>

						<section>
							{/* //TODO: Add delete logic */}
							<div className='event-layers'>
								{subtitles.map((sub, index) => (
									<div className={`layer`} key={index}>
										<div className={`handle`}	onClick={()=>handleFocus(index)}>
											{/* <div className={`handle`} onClick={()=>addSubToLayer(index)}> */}
											{/* <p>{sub.title !== `` ? sub.title : `No Title`}<img alt={`delete subtitle track`} className={`layer-delete`} src={trashIcon} width='20px' onClick={()=>handleDeleteSubLayer(index)} /></p> */}
											<SubtitlesCard
												title={sub.title !== `` ? sub.title : isEdit ? `` : `No Title`}
												updateTitle={updateSubLayerTitle}
												isEdit={isEdit}
												subLayer={subLayerToEdit}
												index={index}
											/>
											{
												subLayerToEdit === index && isEdit ?
													<Icon className={`saveIcon`} src={saveIcon} onClick={() => setIsEdit(false)}></Icon>
													:
													<Icon className={`editIcon`} src={editIcon} onClick={() => handleEditSubTitle(index)}></Icon>
											}
											<Icon className={`trashIcon`} src={trashIcon} onClick={()=>handleDeleteSubLayer(index)}/>
										</div>
										<SubtitlesLayer
											videoLength={videoLength}
											minimized={eventListMinimized}
											width={layerWidth}
											subs={sub[`content`]}
											activeEvent={subToEdit}
											layer={index}
											index={subToEdit}
											// onDrop={(item)=>addSubToLayer(item,index)}
											sideEditor={openSubEditor}
											updateSubs={updateSubs}
											closeEditor={closeSideEditor}
											displayLayer={subLayerToEdit}
										/>
									</div>
								))
								}
								<div style={{color:`#ffffff`,backgroundColor:`#0582ca`,borderRadius:`0.6rem`,width:`130px`, margin:`10px`,textAlign:`center`,padding:`5px`,cursor:`pointer`}} className={`setSubModalVisible`} onClick={()=>{
									setSubModalVisible(true)
									setSubModalMode(`create`)
									// addSubToLayer(subtitles.length+1)
								}}>
									<p style={{fontWeight:700}}>Add Subtitle Track +</p>
								</div>
								<br/><br/><br/><br/><br/><br/><br/>
							</div>

						</section>
						<div className='zoom-controls'>
							{/* ADD ZOOM ICON */}
							<div className='zoom-factor' style={{ visibility: `${timelineMinimized ? ` hidden` : `initial`}`}}>
								<img src={zoomOut} style={{ width: `20px` }}/>
								<Rnd
									className={`zoom-indicator`}
									bounds={`parent`}
									enableResizing={{top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false}}
									dragAxis='x'
									onDragStop={(e, d) => handleZoomChange(e, d)}
									onMouseEnter={e => handleShowTip(`te-zoom`, {x: e.target.getBoundingClientRect().x, y: e.target.getBoundingClientRect().y, width: e.currentTarget.offsetWidth})}
									onMouseLeave={e => toggleTip()}
								></Rnd>
								<img src={zoomIn} style={{ float: `right`, width: `20px`}}/>
							</div>
							<div className='zoom-scroll' style={{ visibility: `${timelineMinimized ? ` hidden` : `initial`}`}}>

								<div style={{ width: `90%`, height: `100%`, display: `flex`, marginLeft: `5%` }}>
									<span onClick={ e => handleScrollFactor(`start`) } style={{ margin: `auto` }}
										onMouseEnter={e => handleShowTip(`te-scroll-start`, {x: e.target.getBoundingClientRect().x, y: e.target.getBoundingClientRect().y + 10, width: e.currentTarget.offsetWidth})}
										onMouseLeave={e => toggleTip()}
									><img src={llIcon}/></span>
									<span onClick={ e => handleScrollFactor(`left`) } style={{ margin: `auto` }}
										onMouseEnter={e => handleShowTip(`te-scroll-left`, {x: e.target.getBoundingClientRect().x, y: e.target.getBoundingClientRect().y + 10, width: e.currentTarget.offsetWidth})}
										onMouseLeave={e => toggleTip()}><img src={lIcon}/></span>

									<div className={`zoom-scroll-container`}>
										<div className={`zoom-scroll-indicator`}
											onMouseEnter={e => handleShowTip(`te-scroll`, {x: e.target.getBoundingClientRect().x, y: e.target.getBoundingClientRect().y + 10, width: e.currentTarget.offsetWidth})}
											onMouseLeave={e => toggleTip()}></div>
									</div>

									<span onClick={ e => handleScrollFactor(`right`) } style={{ margin: `auto` }}
										onMouseEnter={e => handleShowTip(`te-scroll-right`, {x: e.target.getBoundingClientRect().x, y: e.target.getBoundingClientRect().y+ 10, width: e.currentTarget.offsetWidth})}
										onMouseLeave={e => toggleTip()}><img src={rIcon}/></span>
									<span onClick={ e => handleScrollFactor(`end`) } style={{ margin: `auto` }}
										onMouseEnter={e => handleShowTip(`te-scroll-end`, {x: e.target.getBoundingClientRect().x, y: e.target.getBoundingClientRect().y + 10, width: e.currentTarget.offsetWidth})}
										onMouseLeave={e => toggleTip()}><img src={rrIcon}/></span>
								</div>
								<div id={`time-indicator-container`}>
									<div id={`layer-time-indicator`}>
										<span id={`layer-time-indicator-line`}></span>
									</div>
								</div>
							</div>
						</div>
					</Timeline>

				</span>

				<EventList minimized={eventListMinimized}>

					<header>
						<img src={helpIcon} onClick={handleShowHelp} style={{marginLeft:10,marginTop:15}}/>
						<div className={`save`}>
							<button onClick={handleSaveAnnotation}>

								{blockLeave ?
									null
									:
									isLoading ?
										<i className='fa fa-refresh fa-spin'/>
										:
										<i className='fa fa-check'></i>
								}
								<span>Save</span>
							</button>
						</div>
					</header>

					<>
						{ showSideEditor !== false && (
							<SubtitleEditorSideMenu
								updateLanguage = {updateSubLayerLanguage}
								updateTitle = {updateSubLayerTitle}
								singleEvent={checkSub}
								videoLength={videoLength}
								closeSideEditor={closeSideEditor}
								updateSubs={updateSubs}
								isSub={subSelected}
								subs={subtitles}
								subLayer={subLayerToEdit}
								changeSubIndex={handleChangeSubIndex}
								addSub={addSubToLayer}
								editCensor = {editCensor}
								activeCensorPosition = {activeCensorPosition}
								setActiveCensorPosition = {setActiveCensorPosition}
								deleteSub = {deleteSub}
								index={subToEdit}
								focus={focus}
							></SubtitleEditorSideMenu>
						) }
					</>
				</EventList>
			</DndProvider>
			<>
				<AnnotationMessage style={{ visibility: `${annotationsSaved ? `visible` : `hidden`}`, opacity: `${annotationsSaved ? `1` : `0`}` }}>
					<img src={closeIcon} width='20' height='20' onClick={ e => setSaved(false)}/>
					{
						contentError !== `` || subtitleError !== `` ? (
							<h2 id='error'>
								<span>Content failed with: {contentError}</span><br/><br/><span>Subtitle failed with: {subtitleError}</span>
							</h2>
						) : (
							<h2 id='success'>Annotations saved successfully</h2>
						)
					}
				</AnnotationMessage>
				<Prompt
					when={blockLeave}
					message='Have you saved your changes already?'
				/>
			</>
		</Style>
	)
}

export default SubtitleEditor
