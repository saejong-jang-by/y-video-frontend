import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { roles } from 'models/User'

import { interfaceService, adminService } from 'services'

import { Manager } from 'components'

import CreateCollectionContainer from 'components/modals/containers/CreateCollectionContainer'
import { objectIsEmpty } from 'lib/util'

/**
 * DO NOT EDIT THIS FILE UNLESS YOU KNOW WHAT YOU'RE DOING
 */

const ManagerContainer = props => {

	const {
		admin,
		collections,
		professor,
		searchCollections,
		setHeaderBorder,
		setProfessor,
		toggleModal,
	} = props

	const params = useParams()

	const professorId = params.professorId

	useEffect(() => {
		setHeaderBorder(true)
		if(objectIsEmpty(professor)) {
			setProfessor(professorId)
			searchCollections(professorId, true)
		}

		return () => {
			setHeaderBorder(false)
		}
	}, [professor, professorId, searchCollections, setHeaderBorder, setProfessor])

	console.log(professor)
	if(!professor || objectIsEmpty(professor)) return null

	const professorCollections = {}
	collections.filter(collection => collection.owner === professor.id).forEach(collection => professorCollections[collection.id] = collection)

	const sideLists = {
		published: [],
		unpublished: [],
		archived: [],
	}

	Object.keys(professorCollections).forEach(id => {
		const { archived, published, name } = professorCollections[id]

		if (archived) sideLists.archived.push({ id, name })
		else if (published) sideLists.published.push({ id, name })
		else sideLists.unpublished.push({ id, name })
	})

	const createNew = () => {
		toggleModal({
			component: CreateCollectionContainer,
		})
	}

	const viewstate = {
		admin,
		collection: professorCollections[params.collectionId],
		path: `lab-assistant-manager/${professor.id}`,
		sideLists,
		user: professor,
	}

	const handlers = {
		createNew,
	}

	return <Manager viewstate={viewstate} handlers={handlers} />
}

const mapStateToProps = store => ({
	professor: store.adminStore.professor,
	collections: store.adminStore.professorCollections,
	admin: store.authStore.user.roles.includes(roles.admin),
})

const mapDispatchToProps = {
	searchCollections: adminService.searchCollections,
	setHeaderBorder: interfaceService.setHeaderBorder,
	setProfessor: adminService.setProfessor,
	toggleModal: interfaceService.toggleModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerContainer)
