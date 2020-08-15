import React, { PureComponent } from 'react'

import Style, { Search, DepartmentSelect, CatalogInput, SectionInput, AddButton } from './styles'

import { PermissionTable } from 'components/bits'

import { departments } from 'lib/util'

export class CollectionPermissions extends PureComponent {
	render() {

		const {
			viewstate,
			handlers,
		} = this.props

		const {
			roles,
			state,
		} = viewstate

		const {
			department,
			catalog,
			section,
			disabled,
			taFaculty,
			exception,
		} = state

		const {
			admins = [],
			courses = [],
			exceptions = [],
		} = roles

		const reducedCourses = courses.map(item => ({
			id: item.id,
			Department: item.department,
			Catalog: item.catalogNumber,
			Section: item.sectionNumber,
		}))

		const reducedAdmins = admins.map(item => ({
			id: item.id,
			Name: item.name,
			NetID: item.username,
			Email: item.email,
		}))

		const reducedExceptions = exceptions.map(item => ({
			id: item.id,
			Name: item.name,
			NetID: item.username,
			Email: item.email,
		}))

		return (
			<Style>

				<h4>Courses</h4>

				<form onSubmit={handlers.addCourse}>
					<DepartmentSelect className='department-select' value={department} onChange={handlers.handleDepartmentChange} placeholder="Enter department (EX: ENG)"/>

					{/* <DepartmentSelect className='department-select' value={department} onChange={handlers.handleDepartmentChange}>
						<option value='*' disabled>Select Department</option>
						{departments.map((item, index) =>
							<option value={item.code} key={index}>
								{`${item.code} - ${item.name}`}
							</option>,
						)}
					</DepartmentSelect> */}
					<CatalogInput className='catalog-input' min='0' onChange={handlers.handleCatalogChange} value={catalog} placeholder='Enter Catalog Number' disabled={disabled.catalog} />
					<SectionInput className='section-input' min='0' onChange={handlers.handleSectionChange} value={section} placeholder='Enter Section Number' disabled={disabled.section} />
					<AddButton className='add-course-button' type='submit' disabled={disabled.submit}>Add</AddButton>
				</form>

				<PermissionTable placeholder={`Enter courseID`} data={reducedCourses} removeFunc={handlers.removeCourse} />

				<h4>TA / Faculty</h4>

				<Search className='faculty-submit' onSubmit={handlers.addTaFaculty}>
					<input className='faculty-input' type='search' placeholder={`Enter netID or name`} onChange={handlers.handleTaFacultyChange} value={taFaculty} />
					<AddButton className='add-faculty-button' type='submit' disabled={disabled.taFaculty}>Add</AddButton>
				</Search>

				<PermissionTable data={reducedAdmins} removeFunc={handlers.removeFaculty} />

				<h4>Audit Exceptions</h4>

				<Search className='exceptions-submit' onSubmit={handlers.addException}>
					<input className='exceptions-input' type='search' placeholder={`Enter netID or name`} onChange={handlers.handleExceptionChange} value={exception} />
					<AddButton className='add-exceptions-button' type='submit' disabled={disabled.exception}>Add</AddButton>
				</Search>

				<PermissionTable className='exceptions-table' data={reducedExceptions} removeFunc={handlers.removeException} />

			</Style>
		)
	}
}

export default CollectionPermissions
