import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { collectionService, interfaceService } from 'services'

import { Manager } from 'components'

import { Tooltip } from 'components/bits'

import CreateCollectionContainer from 'components/modals/containers/CreateCollectionContainer'
import HelpDocumentation from 'components/modals/containers/HelpDocumentationContainer'

import { objectIsEmpty } from 'lib/util'

const ManagerContainer = props => {

	const {
		admin,
		collections,
		getCollections,
		setHeaderBorder,
		toggleModal,
		toggleTip,
		newCollectionInfo,
		removeCreatedCollectionIdFromStore,
	} = props

	const params = useParams()
	const location = useLocation()
	const history = useHistory()
	const [count, setCount] = useState(0) // set a count just to keep track of how many times we call get collections and make sure we only call with force = true only once.

	useEffect(() => {
		setHeaderBorder(true)

		if(count === 0){ // if we have not called gt collections with force = true just call it once to make sure that we get all the collections.
			getCollections(true)// when we use get collections and pass force = true we are saying that no matter if we already have info in the store that we want to re render after this call
			// this way forcing the component to get data from the back end and rendering the component again.
			// this is done because we want to prevent a user from having zero collections, so this way if collections returns zero this means that we are 100% sure that the user has no collections
			setCount(count + 1)
		}

		// open newly created collection immediately
		if(Object.keys(newCollectionInfo).length !== 0){
			history.push({
				pathname: `/manager/${newCollectionInfo}`,
			})
			removeCreatedCollectionIdFromStore()
		}

		if(location.createCollection) {
			toggleModal({
				component: CreateCollectionContainer,
				route: `manager`,
			})
		}
	}, [collections, getCollections, setHeaderBorder, location.createCollection, toggleModal, newCollectionInfo])

	const createNew = () => {
		toggleModal({
			component: CreateCollectionContainer,
			isLabAssistantRoute: false,
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

	const handleShowHelp = () => {
		toggleModal({
			component: HelpDocumentation,
			props: { name: `Manage Collections`},
		})
	}

	const handlers = {
		createNew,
		handleShowHelp,
		toggleTip,
		handleShowTip,
	}

	const sideLists = {
		published: [],
		unpublished: [],
		archived: [],
	}

	if (objectIsEmpty(collections)) return <Manager viewstate={{}} handlers={handlers} empty={true}/>

	Object.keys(collections).forEach(id => {
		const { archived, published, name } = collections[id]

		if(collections[id].public) return

		if (archived) sideLists.archived.push({ id, name })
		else if (published) sideLists.published.push({ id, name })
		else sideLists.unpublished.push({ id, name })

	})

	const viewstate = {
		admin,
		collection: collections[params.id],
		path: `manager`,
		sideLists,
		activeId: params.id,
	}

	return <Manager viewstate={viewstate} handlers={handlers} />
}

const mapStateToProps = store => ({
	collections: store.collectionStore.cache,
	admin: store.authStore.user.roles === 0,
	newCollectionInfo: store.collectionStore.newCollectionId,
})

const mapDispatchToProps = {
	getCollections: collectionService.getCollections,
	setHeaderBorder: interfaceService.setHeaderBorder,
	toggleModal: interfaceService.toggleModal,
	toggleTip: interfaceService.toggleTip,
	removeCreatedCollectionIdFromStore: collectionService.removeCreatedCollectionIdFromStore,
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerContainer)
