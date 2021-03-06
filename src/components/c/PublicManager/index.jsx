import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import { ManageCollectionContainer } from 'containers'

import { Accordion } from 'components/bits'

import {
	Body,
	Container,
	CreateButton,
	NoCollection,
	SideMenu,
	Help,
	Button,
	PlusIcon,
	FeedbackMessage,
} from './styles'

import helpIcon from 'assets/manage-collection-help-circle.svg'

export default class PublicManager extends PureComponent {
	render() {

		const {
			admin,
			collection,
			path,
			sideLists,
			user,
			activeId,
		} = this.props.viewstate

		const {
			createNew,
			handleShowHelp,
			handleShowTip,
			toggleTip,
		} = this.props.handlers

		return (
			<Container>
				{ this.props.empty !== undefined ? (
					<>
						{ user ? (
							<>
								<h1 className='no-collections'>{ user.name } does not have any collections</h1>
								<div id={`create-button`}>
									<button onClick={createNew}>Create New Public Collection</button>
								</div>
							</>
						) : (
							<>
								<CreateButton onClick={createNew}><PlusIcon/>Public Collection</CreateButton>
								<FeedbackMessage><p>There are no public collections</p></FeedbackMessage>
							</>
						) }
					</>
				) : (
					<>
						<SideMenu>
							<CreateButton className='collection-create' onClick={createNew}><PlusIcon />Public Collection</CreateButton>
							<h4 className='collection-username'>{user ? `${user.name}'s Public Collections` : `Public Collections`}
								<Help
									onMouseEnter={e => handleShowTip(`help`, {x: e.target.getBoundingClientRect().x + 10, y: e.target.getBoundingClientRect().y + 5, width: e.currentTarget.offsetWidth})}
									onMouseLeave={e => toggleTip()}
								>
									<img className='help-document' src={helpIcon} onClick={handleShowHelp}/>
								</Help>
							</h4>

							{
								admin &&
								<>
									<Accordion header={`Public Collections`} active>
										{sideLists.publicCollections.map(({ id, name }, index) => <div key={index} className={`${id === activeId ? `active-collection link` : `link`}`}><Link to={`/${path}/${id}`} >{name}</Link></div>)}
									</Accordion>

									<Accordion header={`Archived`} active>
										{sideLists.publicArchived.map(({ id, name }, index) => <div key={index} className={`${id === activeId ? `active-collection link` : `link`}`}><Link to={`/${path}/${id}`} >{name}</Link></div>)}
									</Accordion>
								</>
							}

						</SideMenu>
						<Body>
							{collection ?
								admin ?
									// <LabAssistantManageCollectionContainer collection={collection} published={collection.published} archived={collection.archived} />
									<ManageCollectionContainer collection={collection} published={collection.published} archived={collection.archived} />
									:
									<NoCollection className='only-admin-body'>Permission Denied.</NoCollection>
								:
								<NoCollection className='no-collections-body'>Select a Collection to get started.</NoCollection>}
						</Body>
					</>
				)}
			</Container>
		)
	}
}