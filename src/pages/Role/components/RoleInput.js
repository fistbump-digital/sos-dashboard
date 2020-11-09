import { Checkbox, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { roleEndpoint } from '../../../api'
import Controls from '../../../components/Controls'
import {
	Card,
	CardTitle,
	ContentContainer,
	ControlButton,
	RemoveSpaces,
	StyledCheckbox,
} from '../../../styles'
import { SMUITextField } from '../../../styles/StyledMaterialUI'

import { toast } from '../../../components/Toast'
import { useHistory } from 'react-router-dom'

function RoleInput() {
	const history = useHistory()

	const [name, setName] = useState('')
	const [vendor, setVendor] = useState('')

	const defaultPermissions = {
		job: {
			create: false,
			update: false,
			read: false,
			delete: false,
		},
		candidate: {
			create: false,
			update: false,
			read: false,
			delete: false,
		},
		user: {
			create: false,
			update: false,
			read: false,
			delete: false,
		},
		role: {
			create: false,
			update: false,
			read: false,
			delete: false,
		},
	}

	const [permissions, setPermissions] = useState(defaultPermissions)

	useEffect(() => {}, [])

	const resetHandler = () => {}

	const submitHandler = async () => {
		console.log({ permissions })
		const roleData = {
			name,
			vendor,
			permissions,
		}
		try {
			await axios.post(roleEndpoint, roleData, { withCredentials: true })
			history.goBack()
			toast.success('New Role Added')
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	const checkHandler = (e, role, type) => {
		const checked = e.target.checked
		const permissionsTemp = { ...permissions[role] }
		permissionsTemp[type] = checked
		if (
			!(
				type === 'read' &&
				(permissionsTemp['delete'] || permissionsTemp['update'])
			)
		) {
			if ((type === 'delete' && checked) || (type === 'update' && checked)) {
				permissionsTemp['read'] = checked
			}
			setPermissions({
				...permissions,
				[role]: permissionsTemp,
			})
		}
	}

	const selectAllHandler = (e, role) => {
		const checked = e.target.checked
		const permissionsTemp = { ...permissions[role] }
		permissionsTemp.read = checked
		permissionsTemp.create = checked
		permissionsTemp.update = checked
		permissionsTemp.delete = checked
		setPermissions({
			...permissions,
			[role]: permissionsTemp,
		})
	}
	return (
		<>
			<Controls title='Add Role'>
				<ControlButton color='secondary'>Reset</ControlButton>
				<ControlButton
					onClick={submitHandler}
					variant='contained'
					color='primary'>
					Save
				</ControlButton>
			</Controls>

			<ContentContainer>
				<Card>
					<CardTitle>Role Details</CardTitle>
					<SMUITextField
						variant='outlined'
						value={name}
						onChange={(e) => setName(e.target.value)}
						label='Role Name'
					/>
					<SMUITextField
						variant='outlined'
						value={vendor}
						onChange={(e) => setVendor(e.target.value)}
						label='Vendor'
					/>
				</Card>
				<Card>
					<CardTitle>Permissions</CardTitle>
					<PermissionTable>
						<thead>
							<PermissionTableRow>
								<PermissionTableHead>
									<StyledCheckbox
										onChange={(e) => selectAllHandler(e, 'job')}
										type='checkbox'
									/>
									<Content>Jobs</Content>
								</PermissionTableHead>

								<PermissionTableHead>
									<StyledCheckbox
										onChange={(e) => selectAllHandler(e, 'candidate')}
										type='checkbox'
									/>
									<Content>Candidates</Content>
								</PermissionTableHead>
								<PermissionTableHead>
									<StyledCheckbox
										onChange={(e) => selectAllHandler(e, 'role')}
										type='checkbox'
									/>
									<Content>Roles</Content>
								</PermissionTableHead>
								<PermissionTableHead>
									<StyledCheckbox
										onChange={(e) => selectAllHandler(e, 'user')}
										type='checkbox'
									/>
									<Content>User</Content>
								</PermissionTableHead>
							</PermissionTableRow>
						</thead>
						<tbody>
							<PermissionTableRow>
								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.job.read}
										onChange={(e) => checkHandler(e, 'job', 'read')}
										type='checkbox'
									/>
									<Content>Read</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.candidate.read}
										onChange={(e) => checkHandler(e, 'candidate', 'read')}
										type='checkbox'
									/>
									<Content>Read</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.role.read}
										onChange={(e) => checkHandler(e, 'role', 'read')}
										type='checkbox'
									/>
									<Content>Read</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.user.read}
										onChange={(e) => checkHandler(e, 'user', 'read')}
										type='checkbox'
									/>
									<Content>Read</Content>
								</PermissionTableData>
							</PermissionTableRow>

							<PermissionTableRow>
								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.job.create}
										onChange={(e) => checkHandler(e, 'job', 'create')}
										type='checkbox'
									/>
									<Content>Create</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.candidate.create}
										onChange={(e) => checkHandler(e, 'candidate', 'create')}
										type='checkbox'
									/>
									<Content>Create</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.role.create}
										onChange={(e) => checkHandler(e, 'role', 'create')}
										type='checkbox'
									/>
									<Content>Create</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.user.create}
										onChange={(e) => checkHandler(e, 'user', 'create')}
										type='checkbox'
									/>
									<Content>Create</Content>
								</PermissionTableData>
							</PermissionTableRow>

							<PermissionTableRow>
								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.job.update}
										onChange={(e) => checkHandler(e, 'job', 'update')}
										type='checkbox'
									/>
									<Content>Update</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.candidate.update}
										onChange={(e) => checkHandler(e, 'candidate', 'update')}
										type='checkbox'
									/>
									<Content>Update</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.role.update}
										onChange={(e) => checkHandler(e, 'role', 'update')}
										type='checkbox'
									/>
									<Content>Update</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.user.update}
										onChange={(e) => checkHandler(e, 'user', 'update')}
										type='checkbox'
									/>
									<Content>Update</Content>
								</PermissionTableData>
							</PermissionTableRow>

							<PermissionTableRow>
								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.job.delete}
										onChange={(e) => checkHandler(e, 'job', 'delete')}
										type='checkbox'
									/>
									<Content>Delete</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.candidate.delete}
										onChange={(e) => checkHandler(e, 'candidate', 'delete')}
										type='checkbox'
									/>
									<Content>Delete</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.role.delete}
										onChange={(e) => checkHandler(e, 'role', 'delete')}
										type='checkbox'
									/>
									<Content>Delete</Content>
								</PermissionTableData>

								<PermissionTableData>
									<StyledCheckbox
										checked={permissions.user.delete}
										onChange={(e) => checkHandler(e, 'user', 'delete')}
										type='checkbox'
									/>
									<Content>Delete</Content>
								</PermissionTableData>
							</PermissionTableRow>
						</tbody>
					</PermissionTable>
				</Card>
			</ContentContainer>
		</>
	)
}

export default RoleInput

const RoleTextField = styled(TextField)`
	&& {
		width: 100%;
		margin: 5px 0px;
	}
`
const Title = styled.h5`
	text-align: left;
	${RemoveSpaces};
	padding: 10px 0px;
`

const PermissionTable = styled.table`
	width: 100%;
	text-align: left;
	border-collapse: collapse;
`
const PermissionTableRow = styled.tr`
	display: flex;
`

const PermissionTableData = styled.td`
	display: flex;
	align-items: center;
	flex: 1;
`

const PermissionTableHead = styled.th`
	display: flex;
	align-items: center;
	flex: 1;
`

const Content = styled.p`
	${RemoveSpaces};
	padding-left: 10px;
`
