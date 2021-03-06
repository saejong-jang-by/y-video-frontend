/* eslint-disable no-prototype-builtins */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import services from 'services'

import { Root } from 'components'

const RootContainer = props => {

	const {
		user,
		loading,
		tried,
		modal,
		tip,
		checkAuth,
	} = props

	useEffect(() => {
		if (!user && !tried) checkAuth()
	}, [checkAuth, tried, user])

	const viewstate = {
		user,
		loading,
		modal,
		tip,
	}

	return <Root viewstate={viewstate} />
}

const mapStoreToProps = ({ authStore, interfaceStore, collectionStore, contentStore, resourceStore }) => ({
	user: authStore.user,
	loading: authStore.loading,
	tried: authStore.tried,
	modal: interfaceStore.modal,
	tip: interfaceStore.tip,
})

const mapDispatchToProps = {
	checkAuth: services.authService.checkAuth,
}

export default connect(mapStoreToProps, mapDispatchToProps)(RootContainer)
