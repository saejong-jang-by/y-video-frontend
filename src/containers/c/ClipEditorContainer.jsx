import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { connect } from 'react-redux'

import { interfaceService, resourceService, contentService, subtitlesService } from 'services'

import { ClipEditor } from 'components'

import { Tooltip } from 'components/bits'

import HelpDocumentation from 'components/modals/containers/HelpDocumentationContainer'

const ClipEditorContainer = props => {

	const {
		content,
		resource,
		setEvents,
		getResource,
		getContent,
		updateContent,
		allSubs,
		getSubtitles,
		updateSubtitle,
		createSubtitle,
		setSubtitles,
		activeUpdate,
		deleteSubtitle,
		subContentId,
		getStreamKey,
		streamKey,
		toggleModal,
		toggleTip,
		setSubContentId,
	} = props

	const {id} = useParams()
	const [calledGetSubtitles, setCalledGetSubtitles] = useState(false)
	const [url, setUrl] = useState(``)
	const [eventsArray, setEventsArray] = useState([])
	const [currentContent, setCurrentContent] = useState({})
	const [subs,setSubs] = useState([])

	const getAllSubtitles = async() => {
		// console.log(`yeep`,id)
		const testsubs = await getSubtitles(id)
		// console.log(`more testing`,testsubs)
		const returnThis = testsubs !== undefined?testsubs:[]
		return returnThis
	}
	useEffect(() => {
		// console.log('use effecct')
		if(!content.hasOwnProperty(id)){
			// console.log(`getContent`)
			getContent(id)
		}

		if(content[id] !== undefined){
			setCurrentContent(content[id])
			setEventsArray(content[id].settings.annotationDocument)
			setEvents(content[id].settings.annotationDocument)
			// we only want to set the url if it is not set.
			if(url === ``){
				if(content[id].url !== ``)
					setUrl(content[id].url)
				else {
					// CHECK RESOURCE ID
					if(content[id].resourceId !== `00000000-0000-0000-0000-000000000000` && streamKey === ``){
						// VALID RESOURCE ID SO WE KEEP GOING TO FIND STREAMING URL
						getStreamKey(content[id].resourceId, content[id].settings.targetLanguages)
					} else if (streamKey !== `` && url === ``)
						setUrl(`${process.env.REACT_APP_YVIDEO_SERVER}/api/media/stream-media/${streamKey}`)
						// console.log('URL SHOULD BE ,', `${process.env.REACT_APP_YVIDEO_SERVER}/api/media/stream-media/${streamKey}` )
				}
			} else{
				// once the url is set we can get subtitles
				if(!calledGetSubtitles){
					// console.log("TRY TO GER SUBTITLES")
					getSubtitles(id)
					setCalledGetSubtitles(true)
				} else {
					// console.log("SETTING SUBTITLES")
					setSubs(allSubs)
				}
			}
		}
		// console.log(eventsArray,subs)
	}, [content, resource, eventsArray, currentContent, subs, setSubs, allSubs, getSubtitles, streamKey, url, subContentId])

	// console.log(eventsArray)

	// console.log(eventsArray)

	const handleShowHelp = () => {
		toggleModal({
			component: HelpDocumentation,
			props: { name: `Clip Editor`},
		})
	}

	const handleShowTip = (tipName, position) => {
		toggleTip({
			component: Tooltip,
			props: {
				name: tipName,
				position,
			},
		})
	}

	const viewstate = {
		currentContent,
		url,
		eventsArray,
		subs,
		allSubs,
	}

	const handlers = {
		toggleTip,
		handleShowTip,
	}

	return <ClipEditor
		viewstate={viewstate}
		updateContent={updateContent}
		activeUpdate={activeUpdate}
		handleShowHelp={handleShowHelp}
		handlers={handlers}/>
}

const mapStoreToProps = ({ contentStore, resourceStore, subtitlesStore }) => ({
	resource: resourceStore.cache,
	content: contentStore.cache,
	allSubs: subtitlesStore.cache,
	subContentId: subtitlesStore.contentId,
	streamKey: resourceStore.streamKey,
})

const mapThunksToProps = {
	setEvents: interfaceService.setEvents,
	getResource: resourceService.getResources,
	getContent: contentService.getContent,
	getStreamKey: resourceService.getStreamKey,
	updateContent: contentService.updateContent,
	getSubtitles: subtitlesService.getSubtitles,
	setSubtitles: subtitlesService.setSubtitles,
	deleteSubtitle: subtitlesService.deleteSubtitle,
	updateSubtitle: subtitlesService.updateSubtitle,
	createSubtitle: subtitlesService.createSubtitle,
	activeUpdate: subtitlesService.activeUpdate,
	setSubContentId: subtitlesService.setContentId,
	toggleModal: interfaceService.toggleModal,
	toggleTip: interfaceService.toggleTip,
}

export default connect(mapStoreToProps, mapThunksToProps)(ClipEditorContainer)