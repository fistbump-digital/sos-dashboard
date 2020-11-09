import React, { useEffect, useState } from 'react'
import {
	ContentContainer,
	StyledCheckbox,
	TableHead,
	TableData,
	TableRow,
	ModalBody,
	ModalTitle,
	ModalWarning,
	ModalText,
	ModalButtonContainer,
} from '../../styles'
import Controls from '../../components/Controls'
import { IconButton } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
	companyAtom,
	companyCheckedAtom,
	currentUserAtom,
} from '../../recoil/atoms'
import axios from 'axios'
import { companiesEndpoint } from '../../api'
import { v4 as uuid } from 'uuid'
import Table from '../../components/Table'
import {
	formatDate,
	renderWithLoader,
} from '../../utils/helperFunctions'
import { selectedCompanies } from '../../recoil/selectors'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { SMUIButton, SMUIIconButton, SMUIModal } from '../../styles/StyledMaterialUI'

import { toast } from '../../components/Toast'
import { get } from 'lodash'

function CompanyPage() {
	const history = useHistory()
	const location = useLocation().pathname
	const [companies, setCompanies] = useRecoilState(companyAtom)
	const [checked, setChecked] = useRecoilState(companyCheckedAtom)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const currentUser = useRecoilValue(currentUserAtom)
	const selectedCompany = useRecoilValue(selectedCompanies)

	useEffect(() => {
		axios.get(companiesEndpoint, { withCredentials: true })
			.then(({ data }) => setCompanies(data))
			.catch((e) => console.log(e))
	}, [isModalOpen])

	const navHandler = (to) => {
		history.push(`${location}/${to}`)
	}
	
	const companyHeading = [
		'Select',
		'Company Name',
		'Company Address',
		'Jobs Assigned',
		'Created On',
	]

	const renderCompanyHeading = companyHeading.map((heading) => (
		<TableHead key={uuid()}>{heading}</TableHead>
	))


	const checkHandler = (e, _id) => {
		setChecked({ ...checked, [_id]: e.target.checked })
	}

	const deleteManyHandler = async () => {
		try {
			await axios.patch(companiesEndpoint, selectedCompany, {
				withCredentials: true,
			})
			toggleModal()
			setChecked({})
			toast.success('Companies deleted')
		} catch (error) {
			toggleModal()

			toast.success('Something went wrong')
		}
	}

	const toggleModal = () => setIsModalOpen(!isModalOpen)

	const renderCompanyData =
		companies &&
		companies.map(({ _id, companyName, companyAddress, jobIds, createdAt }) => {
			return (
				<TableRow key={_id}>
					<TableData>
						<StyledCheckbox
							onChange={(e) => checkHandler(e, _id)}
							checked={checked[_id] || false}
							type='checkbox'
						/>
					</TableData>

					<TableData>{companyName}</TableData>
					<TableData>{companyAddress}</TableData>
					<TableData>{jobIds.length}</TableData>
					<TableData>{formatDate(createdAt)}</TableData>
				</TableRow>
			)
		})

	return (
		<>
			<Controls title='Company'>
				{selectedCompany.length > 0 ? (
					<>
						{get(currentUser, 'roleId.permissions.job.delete') && (
							<SMUIIconButton color='secondary' onClick={toggleModal}>
								<DeleteIcon />
							</SMUIIconButton>
						)}
					</>
				) : (
					<>
						{get(currentUser, 'roleId.permissions.job.create') && (
							<SMUIIconButton color='primary' onClick={() => navHandler('add')}>
								<AddCircleIcon />
							</SMUIIconButton>
						)}
					</>
				)}
			</Controls>
			<SMUIModal open={isModalOpen} onClose={toggleModal}>
				<ModalBody>
					<ModalTitle>{selectedCompany.length} Items Selected</ModalTitle>
					<ModalWarning>Warning: This action cannot be undone</ModalWarning>
					<ModalText>Do you want to delete?</ModalText>
					<ModalButtonContainer>
						<SMUIButton onClick={toggleModal}>Cancel</SMUIButton>
						<SMUIButton
							onClick={deleteManyHandler}
							color='secondary'
							variant='contained'>
							Delete
						</SMUIButton>
					</ModalButtonContainer>
				</ModalBody>
			</SMUIModal>
			<ContentContainer>
				{renderWithLoader(
					companies,
					<Table headings={renderCompanyHeading}>{renderCompanyData}</Table>
				)}
			</ContentContainer>
		</>
	)
}

export default CompanyPage
