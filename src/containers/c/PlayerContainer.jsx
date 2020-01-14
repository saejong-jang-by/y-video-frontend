import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { contentService, resourceService } from 'services'

import { roles } from 'models/User'

import { Player } from 'components'

const PlayerContainer = props => {

	const {
		contentCache,
		getContent,
		resourceCache,
		getResources,
		addView,
	} = props

	const params = useParams()

	const [content, setContent] = useState()
	const [resource, setResource] = useState()

	const [duration, setDuration] = useState(0) // Set duration of the media
	const [muted, setMuted] = useState(false) // Mutes the player
	const [fullscreen, setFullscreen] = useState(false)
	const [hovering, setHovering] = useState(false)
	const [playbackRate, setPlaybackRate] = useState(1.0) // Set the playback rate of the player
	const [player, setPlayer] = useState(null)
	const [playing, setPlaying] = useState(false) // Set to true or false to play or pause the media
	const [progress, setProgress] = useState({played: 0.12, playedSeconds: 11.3, loaded: 0.34, loadedSeconds: 16.7})
	const [seeking, setSeeking] = useState(false) // Set to true or false, is player seeking
	const [url, setUrl] = useState(``) // The url of the video or song to play (can be array or MediaStream object)
	const [volume, setVolume] = useState(0.8) // Set the volume, between 0 and 1, null uses default volume on all players

	const ref = player => {
		setPlayer(player)
	}

	useEffect(() => {
		if (!contentCache[params.id]) getContent([params.id])
		else setContent(contentCache[params.id])

		if (content) {
			if (!resourceCache[content.resourceId]) getResources(content.resourceId)
			else setResource(resourceCache[content.resourceId])
		}

		if (resource)
			setUrl(resource.content.files[0].streamUri)

	}, [content, contentCache, getContent, getResources, params.id, resource, resourceCache])

	if(content) addView(params.id)

	const handleDuration = duration => {
		setDuration(duration)
	}

	const handleMouseOver = e => {
		setHovering(true)
	}

	const handleMouseOut = e => {
		setHovering(false)
	}

	const handlePause = () => {
		setPlaying(false)
	}

	const handlePlay = () => {
		setPlaying(true)
	}

	const handlePlaybackRateChange = rate => {
		setPlaybackRate(rate)
	}

	// Potentially use to update current time and maybe progress bar, but only if not seeking?
	// progression = { played: 0.12, playedSeconds: 11.3, loaded: 0.34, loadedSeconds: 16.7 }
	const handleProgress = progression => {
		if (!seeking)
			setProgress(progression)
	}

	const handleSeekChange = e => {
		setProgress({
			...progress,
			played: parseFloat(e.target.value),
		})
	}

	const handleSeekMouseDown = e => {
		setSeeking(true)
	}

	const handleSeekMouseUp = e => {
		setSeeking(false)
		player.seekTo(parseFloat(e.target.value))
	}

	const handleToggleFullscreen = () => {
		// screenfull.request(findDOMNode(this.player))
		setFullscreen(!fullscreen)
	}

	const handleToggleMuted = () => {
		setMuted(!muted)
	}

	const handleVolumeChange = volume => {
		setVolume(volume)
	}

	if (!resource) return null

	const viewstate = {
		duration,
		fullscreen,
		hovering,
		muted,
		playbackRate,
		playing,
		progress,
		ref,
		url,
		volume,
	}

	const handlers = {
		handleDuration,
		handleMouseOut,
		handleMouseOver,
		handlePause,
		handlePlay,
		handlePlaybackRateChange,
		handleProgress,
		handleSeekChange,
		handleSeekMouseDown,
		handleSeekMouseUp,
		handleToggleFullscreen,
		handleToggleMuted,
		handleVolumeChange,
	}

	return <Player viewstate={viewstate} handlers={handlers} />
}

const mapStateToProps = ({ authStore, contentStore, resourceStore }) => ({
	isProf: authStore.user.roles.includes(roles.teacher),
	isAdmin: authStore.user.roles.includes(roles.admin),
	contentCache: contentStore.cache,
	resourceCache: resourceStore.cache,
})

const mapDispatchToProps = {
	getContent: contentService.getContent,
	getResources: resourceService.getResources,
	addView: contentService.addView,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer)
