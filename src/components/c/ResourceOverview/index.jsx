import React, { PureComponent } from 'react'
import Style, {
	InnerContainer,
	Column,
	Preview,
	Buttons,
	EditButton,
	RemoveButton,
	Title,
	TitleEdit,
	RemoveIcon,
	UploadIcon,
	PersonAddIcon,
	SaveIcon,
	TypeButton,
	Type,
	BoxRow,
	FileUploadButton,
	ResourceTitle,
} from './styles'
import { SwitchToggle } from 'components/bits'
import { Prompt } from 'react-router'

export class ResourceOverview extends PureComponent {

	render() {

		const {
			handleResourceName,
			handleFiles,
			handleInstructors,
			handleToggleEdit,
			handleRemoveResource,
			handleTogglePublish,
			handleToggleCopyRighted,
			handleToggleFullVideo,
			handleTypeChange,
			handleFileUploadToResource,
		} = this.props.handlers

		const {
			resource,
			files,
			editing,
			accessCount,
			user,
			blockLeave,
		} = this.props.viewstate

		const {
			resourceName,
			published,
			copyrighted,
			resourceType,
			fullVideo,
		} = resource

		return (
			<>
				<BoxRow>
					<Style>
						<Preview editing={editing}>
							<div>
								{editing ?
									<ResourceTitle><h4>Title:</h4><TitleEdit type='text' value={resourceName} onChange={handleResourceName}/></ResourceTitle>
									:
									<h4 className='resource-name'>{resourceName}</h4>
								}
							</div>
							<Buttons>
								{editing &&
									<>
										{/* TODO: need to figure out how it work on attaching files on resource */}
										{/* <FileUploadButton className='file-attach-button' onClick={handleRegisterInstructors}>Register Instructor<PersonAddIcon/></FileUploadButton> */}
										<FileUploadButton className='file-attach-button' onClick={handleFileUploadToResource}>Upload File<UploadIcon/></FileUploadButton>
										<RemoveButton className='remove-resource-button' onClick={handleRemoveResource}>Delete<RemoveIcon/></RemoveButton>
									</>
								}
								<EditButton className='resource-edit' onClick={handleToggleEdit}>{editing ? `Save` : `Edit`}{editing ? <SaveIcon/> : <></>}</EditButton>
							</Buttons>
						</Preview>
					</Style>
					{editing &&
						<InnerContainer>
							<Column>
								<h4>
									published
									<SwitchToggle on={published} setToggle={handleTogglePublish} data_key='published' />
								</h4>

								<h4>
									full video
									<SwitchToggle on={fullVideo} setToggle={handleToggleFullVideo} data_key='fullVideo' />
								</h4>

								<h4>
									copyrighted
									<SwitchToggle on={copyrighted} setToggle={handleToggleCopyRighted} data_key='copyrighted' />
								</h4>

							</Column>

							<Column>
								<div><h4>Views:</h4><Title>{resource.views} views</Title></div>

								{user.roles === 0 || user.roles === 1 ?
									(
										<div>
											<h4>Instructors: </h4>{ <> <EditButton onClick={handleInstructors}> {accessCount} registered</EditButton></>}
										</div>
									) :
									null
								}
							</Column>

							<Column>
								{/* <div><h4>Email:</h4><TitleEdit type='text' value={requesterEmail} onChange={handleResourceEmail}/></div> */}
								<Type>
									<h4>Type:</h4>
									<TypeButton type='button' selected={resourceType === `video`} onClick={handleTypeChange} data-type='video'>Video</TypeButton>
									<TypeButton type='button' selected={resourceType === `audio`} onClick={handleTypeChange} data-type='audio'>Audio</TypeButton>
									<TypeButton type='button' selected={resourceType === `image`} onClick={handleTypeChange} data-type='image'>Image</TypeButton>
									<TypeButton type='button' selected={resourceType === `text`} onClick={handleTypeChange} data-type='text'>Text</TypeButton>
								</Type>

								<div><h4>Files:</h4>{files && files.length !== 0 ? <><Title>{files && files.length} files</Title> <EditButton onClick={handleFiles}>Edit</EditButton></>: <Title>none</Title>}</div>
							</Column>
						</InnerContainer>
					}
				</BoxRow>
				<Prompt
					when={blockLeave}
					message="Have you saved your changes already?"
				/>
			</>
		)
	}
}

export default ResourceOverview