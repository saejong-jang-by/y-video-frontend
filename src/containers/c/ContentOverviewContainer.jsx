import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Tooltip } from 'components/bits'

import {
	collectionService,
	interfaceService,
	contentService,
	adminService,
} from 'services'

import {
	ContentOverview,
} from 'components'

import HighlightWordsContainer from 'components/modals/containers/HighlightWordsContainer'
import HelpDocumentation from 'components/modals/containers/HelpDocumentationContainer'

import { objectIsEmpty } from 'lib/util'

const ContentOverviewContainer = props => {

	const {
		isExpired,
		content,
		removeCollectionContent,
		updateContent,
		isLabAssistant,
		adminRemoveCollectionContent,
		toggleModal,
		toggleTip,
	} = props

	const history = useHistory()

	const [editing, setEditing] = useState(false)
	const [showing, setShowing] = useState(false)

	const [tag, setTag] = useState(``)

	const [contentState, setContentState] = useState(content)
	const [blockLeave, setBlock] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		if(window.innerWidth < 1000)
			setIsMobile(true)
		else
			setIsMobile(false)

		if(blockLeave)
			window.onbeforeunload = () => true
		else
			window.onbeforeunload = undefined

		return () => {
			window.onbeforeunload = undefined
		}

	}, [blockLeave])

	if (objectIsEmpty(content)) return null
	if (isExpired)
		return <ContentOverview isExpired={true} content={content}/>

	const handleToggleEdit = async () => {
		if (editing) {
			await updateContent(contentState)
			setShowing(false)
			setBlock(false)
			setTimeout(() => {
				setEditing(false)
			}, 500)
		} else
			setEditing(true)

	}

	const handleNameChange = e => {
		setContentState({
			...contentState,
			name: e.target.value,
			resource: {
				...contentState.resource,
				title: e.target.value,
			},
		})
		setBlock(true)
	}

	const handleRemoveContent = e => {
		if(isLabAssistant) {
			adminRemoveCollectionContent(content.id)
			setBlock(true)
		} else {
			removeCollectionContent(content.collectionId, content.id)
			setBlock(true)
		}
	}

	const handleTogglePublish = e => {
		setContentState({
			...contentState,
			published: !contentState.published,
		})
		setBlock(true)
	}

	const handleToggleSettings = e => {
		const { key } = e.target.dataset
		setContentState({
			...contentState,
			settings: {
				...contentState.settings,
				[key]: !contentState.settings[key],
			},
		})
		setBlock(true)
	}

	const handleDescription = e => {
		setContentState({
			...contentState,
			description: e.target.value,
		})
		setBlock(true)
	}

	const addTag = (e) => {
		e.preventDefault()
		const newTags = tag.split(/[ ,]+/)
		setContentState({
			...contentState,
			resource: {
				...contentState.resource,
				keywords: [...contentState.resource.keywords, ...newTags],
			},
		})
		setTag(``)
		setBlock(true)
	}

	const removeTag = e => {
		setContentState({
			...contentState,
			resource: {
				...contentState.resource,
				keywords: contentState.resource.keywords.filter(item => item !== e.target.dataset.value),
			},
		})
		setBlock(true)
	}

	const changeTag = e => {
		setTag(e.target.value)
		setBlock(true)
	}

	const handleShowWordsModal = () => {
		toggleModal({
			component: HighlightWordsContainer,
			props:{ contentId: content.id},
		})
	}

	const handleShowHelp = () => {
		toggleModal({
			component: HelpDocumentation,
			props: { name: `Important Words`},
		})
	}

	const handleLinks = e => {
		e.preventDefault()
		const classname = e.target.className
		if(classname){
			if(classname.includes(`video-editor`)){
				history.push({
					pathname: `/videoeditor/${content.id}`,
				})
			} else if(classname.includes(`subtitle-editor`)){
				history.push({
					pathname: `/subtileeditor/${content.id}`,
				})
			} else if(classname.includes(`clip-manager`)){
				history.push({
					pathname: `/clipeditor/${content.id}`,
				})
			}

		}
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
		content: contentState,
		showing,
		editing,
		tag,
		blockLeave,
		isMobile,
	}

	const handlers = {
		handleNameChange,
		handleRemoveContent,
		handleToggleEdit,
		handleTogglePublish,
		setContentState,
		setShowing,
		updateContent,
		handleToggleSettings,
		handleDescription,
		addTag,
		removeTag,
		changeTag,
		handleShowWordsModal,
		handleShowHelp,
		handleLinks,
		handleShowTip,
		toggleTip,
	}

	return <ContentOverview viewstate={viewstate} handlers={handlers} />
}

const mapDispatchToProps = {
	removeCollectionContent: collectionService.removeCollectionContent,
	updateContent: contentService.updateContent,
	adminRemoveCollectionContent: adminService.deleteContent,
	toggleModal: interfaceService.toggleModal,
	toggleTip: interfaceService.toggleTip,
}

export default connect(null, mapDispatchToProps)(ContentOverviewContainer)