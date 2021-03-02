import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { resourceService, contentService } from 'services'

import { SwitchToggle, Tag, Spinner, LazyImage } from 'components/bits'

import defaultThumbnail from 'assets/default-thumb.svg'

import Style, {
	EditButton,
	Icon,
	Preview,
	PublishButton,
	RemoveButton,
	TitleEdit,
	StyledLink,
	Setting,
	Column,
	InnerContainer,
} from './styles'

class ContentOverview extends PureComponent {
	render() {

		const {
			editing,
			content,
			tag,
			word,
		} = this.props.viewstate

		const {
			handleNameChange,
			handleRemoveContent,
			handleToggleEdit,
			handleTogglePublish,
			addTag,
			removeTag,
			handleToggleSettings,
			handleDescription,
			changeTag,
			addWord,
			removeWord,
			changeWord,
		} = this.props.handlers

		const {
			allowDefinitions,
			showCaptions,
			showAnnotations,
		} = content.settings

		const {
			keywords,
		} = content.resource

		const {
			description,
			words,
		} = content

		// const allowDefinitions = content['allow-definitions'] // <-- ?? -Matthew

		return (
			<Style>
				<Preview>
					<div>
						<LazyImage src={content.thumbnail !== `empty` ? content.thumbnail : defaultThumbnail} height='8rem' width='14rem' />
					</div>
					<div>
						{editing ?
							<TitleEdit type='text' value={content.name} onChange={handleNameChange} />
							:
							<h3 className={`content-title`}>{content.name}</h3>}
						<ul>
							<Icon className='translation' checked={allowDefinitions} />
							<Icon className='captions' checked={showCaptions} />
							<Icon className='annotations' checked={showAnnotations} />
						</ul>
						{editing ||
							<StyledLink to={`/trackeditor/${content.id}`}>Track Editor</StyledLink>
						}
						{editing ?
							<div>
								<PublishButton className='publish-button' published={content.published} onClick={handleTogglePublish}>{content.published ? `Unpublish` : `Publish`}</PublishButton>
								<RemoveButton className='remove-button' onClick={handleRemoveContent}>Delete</RemoveButton>
							</div>
							:
							<em>{content.published ? `Published` : `Unpublished`}</em>
						}
					</div>
					<div>
						<EditButton className='edit-button' onClick={handleToggleEdit}>{editing ? `Save` : `Edit`}</EditButton>
					</div>
				</Preview>
				{editing &&
					<InnerContainer>
						<Column>
							<h4>Allow automatic definitions
								<SwitchToggle className='definitions-toggle' on={allowDefinitions} setToggle={handleToggleSettings} size={1.5} data_key='allowDefinitions' />
							</h4>
							<h4>
								Captions
								<SwitchToggle className='captions-toggle'on={showCaptions} setToggle={handleToggleSettings} size={1.5} data_key='showCaptions' />
							</h4>
						</Column>

						<Column>
							<h4>Tags</h4>
							<div style={{ display: `flex` }}>
								<input type='text' placeholder='Add tags...' onChange={changeTag} value={tag} className='tag-input' />
								<button className={`add-tag`} onClick={addTag}>Add</button>
							</div>
							<br/>
							<div className='tags'>
								{keywords.map((item, index) => item === `` ? null : <Tag key={index} onClick={removeTag}>{item}</Tag>)}
							</div>
							<h4>Words</h4>
							<div style={{ display: `flex` }}>
								<input type='text' placeholder='Add word...' onChange={changeWord} value={word} className='tag-input' />
								<button className={`add-tag`} onClick={addWord}>Add</button>
							</div>
							<br/>
							<div className='tags'>
								{words.map((item, index) => item === `` ? null : <Tag key={index} onClick={removeWord}>{item}</Tag>)}
							</div>
						</Column>

						<Column>
							<h4>Description</h4>
							<textarea rows={4} onChange={handleDescription} value={description} />
						</Column>
					</InnerContainer>
				}
			</Style>
		)
	}
}

const mapStateToProps = state => ({
	resourceCache: state.resourceCache,
})

const mapDispatchToProps = {
	getResources: resourceService.getResources,
	updateContent: contentService.updateContent,
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentOverview)
