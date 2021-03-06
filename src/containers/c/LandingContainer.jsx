import React, { useState } from 'react'
import { connect } from 'react-redux'

import { authService } from 'services'

import { Landing } from 'components'

const LandingContainer = props => {

	const {
		login,
	} = props

	const [overlay, setOverlay] = useState(false)

	const toggleOverlay = () => {
		setOverlay(!overlay)
	}

	const handlePublicCollections = e => {
		// if(e) console.log(e.target.value)
	}

	const handleLogin = e => {
		e.preventDefault()
		login()
	}

	const viewstate = {
		overlay,
	}

	const handlers = {
		toggleOverlay,
		handleLogin,
		handlePublicCollections,
	}

	return <Landing viewstate={viewstate} handlers={handlers} />

}

const mapDispatchToProps = {
	login: authService.login,
}

export default connect(null, mapDispatchToProps)(LandingContainer)
