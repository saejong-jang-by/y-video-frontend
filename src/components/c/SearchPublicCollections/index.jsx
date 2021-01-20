import React, { PureComponent } from 'react'

import {
	PublicListCollectionContainer,
} from 'containers'

import Style, {Search, SearchIcon} from './styles'

export default class SearchPublicCollections extends PureComponent {

	render() {

		const {
			searchedCount,
			searchQuery,
			publicCollections,
			searchedPublicCollections,
		} = this.props.viewstate

		const {
			handleSubmit,
			handleSearchTextChange,
		} = this.props.handlers

		return (
			<Style>
				<header>
					<div>
						<h2>Search Public Collections</h2>
					</div>
				</header>

				<Search className='resource-search-submit' id='searchSubmit' onSubmit={handleSubmit}>
					<SearchIcon />
					<input className='resource-search-input' type='search' placeholder={`search public collections`} onChange={handleSearchTextChange} value={searchQuery} />
					<button type='submit'>Search</button>
				</Search>

				<div className='list'>
					{ Object.keys(publicCollections).length > 0 ? (
						<>
							{ searchedCount === 0 ?
								Object.keys(publicCollections).map(key =>
									<PublicListCollectionContainer key={key} collection={publicCollections[key]}/>,
								):

								Object.keys(searchedPublicCollections).map(key =>
									<PublicListCollectionContainer key={key} collection={searchedPublicCollections[key]}/>,
								)
							}
						</>
					) : (
						<>
							<h1 id='message'>Loading</h1>
							{
								<>
									{
										setTimeout(() => {
											if(document.getElementById(`message`) !== null)
												document.getElementById(`message`).innerHTML = `There are no public collections`

										}, 2000)
									}
								</>
							}
						</>
					) }
				</div>
			</Style>
		)
	}
}