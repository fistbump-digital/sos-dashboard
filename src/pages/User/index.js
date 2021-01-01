import React, { useEffect, useState } from 'react'
import {
	ContentContainer,
	PageLayout,
	TableHead,
	TableRow,
	TableData,
	StyledCheckbox,
} from '../../styles'
import Controls from '../../components/Controls'

import { useHistory, useLocation } from 'react-router-dom'
import AddIcon from '../../assets/icons/add.svg'
import axios from 'axios'
import { usersEndpoint } from '../../api'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentUserAtom, userAtom, userCheckedAtom } from '../../recoil/atoms'
import Table from '../../components/Table'
import {
	formatDate,
	renderWithLoader,
	titleGenerator,
} from '../../utils/helperFunctions'

import { v4 as uuid } from 'uuid'
import { selectedUsers } from '../../recoil/selectors'
import { IconButton } from '@material-ui/core'
import { AddCircle, Delete } from '@material-ui/icons'
import DeleteModal from '../../components/Modals/DeleteModal'

import { toast } from '../../components/Toast'
import { get } from 'lodash'
import { SMUIIconButton } from '../../styles/StyledMaterialUI'

function UserPage() {
	const history = useHistory()
	const location = useLocation().pathname
	const [users, setUsers] = useRecoilState(userAtom)
	const [checked, setChecked] = useRecoilState(userCheckedAtom)
	const selected = useRecoilValue(selectedUsers)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const toggleModal = () => setIsModalOpen(!isModalOpen)
	const currentUser = useRecoilValue(currentUserAtom)
	const navHandler = (to) => {
		history.push(`${location}/${to}`)
	}

	useEffect(() => {
		axios
			.get(usersEndpoint, { withCredentials: true })
			.then(({ data }) => setUsers(data))
			.catch((e) => console.log(e))
	}, [isModalOpen])

	const userHeading = [
		'Select',
		'Fullname',
		'Username',
		'Contact',
		'Email',
		'Assigned Role',
		'Created On',
	]

	const renderUserHeading = userHeading.map((heading) => (
		<TableHead key={uuid()}>{heading}</TableHead>
	))

	const checkHandler = (e, _id) => {
		setChecked({ ...checked, [_id]: e.target.checked })
	}

	const deleteHandler = async () => {
		try {
			await axios.patch(usersEndpoint, selected, { withCredentials: true })
			toggleModal()
			setChecked({})
			toast.success('User Deleted')
		} catch (error) {
			toggleModal()

			toast.error('Something went wrong')
		}
	}
	const showUsers =
		users &&
		users.filter((user) => {
			if (currentUser) {
				return currentUser._id.toString() !== user._id.toString()
			}
		})

		console.log(showUsers);
	const renderUserData =
		showUsers &&
		showUsers.map(
			({
				_id,
				firstName,
				lastName,
				userName,
				contact,
				email,
				roleId,
				createdAt,
			}) => {
				return (
					<TableRow key={_id}>
						<TableData>
							<StyledCheckbox
								onChange={(e) => checkHandler(e, _id)}
								checked={checked[_id] || false}
								type='checkbox'
							/>
						</TableData>

						<TableData>{`${firstName} ${lastName}`}</TableData>
						<TableData>{userName}</TableData>
						<TableData>{contact}</TableData>
						<TableData>{email}</TableData>
						<TableData>{roleId.name}</TableData>
						<TableData>{formatDate(createdAt)}</TableData>
					</TableRow>
				)
			}
		)

	return (
		<>
			<Controls title={titleGenerator(selected, 'Users')}>
				{selected.length ? (
					<>
						{get(currentUser, 'roleId.permissions.user.delete') && (
							<SMUIIconButton color='secondary' onClick={toggleModal}>
								<Delete />
							</SMUIIconButton>
						)}
					</>
				) : (
					<>
						{get(currentUser, 'roleId.permissions.user.create') && (
							<SMUIIconButton color='primary' onClick={() => navHandler('add')}>
								<AddCircle />
							</SMUIIconButton>
						)}
					</>
				)}
			</Controls>
			<DeleteModal
				open={isModalOpen}
				onClose={toggleModal}
				count={selected.length}
				deleteHandler={deleteHandler}
			/>
			<ContentContainer>
				{renderWithLoader(
					users,
					<Table headings={renderUserHeading}>{renderUserData}</Table>
				)}
			</ContentContainer>
		</>
	)
}

export default UserPage
