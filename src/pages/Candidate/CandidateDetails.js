import { IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import axios from 'axios'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { candidateEndpoint } from '../../api'
import Controls from '../../components/Controls'
import PageTab from '../../components/PageTab'
import {
	candidateAtom,
	candidateCheckedAtom,
	singleCandidateAtom,
	candidateTab,
	currentUserAtom,
} from '../../recoil/atoms'
import {
	ContentContainer,
	ControlButton,
	PipelineCard,
	PipelineContainer,
	PipelineStat,
	PipelineTitle,
	TableData,
	TableHead,
	TableRow,
} from '../../styles'
import CandidateInfo from './components/CandidateInfo'
import DeleteModal from '../../components/Modals/DeleteModal'
import {
	counter,
	formatDate,
	renderWithLoader,
} from '../../utils/helperFunctions'
import Table from '../../components/Table'
import { stages } from '../../utils/sharedVariables'

import { toast } from '../../components/Toast'
import { v4 as uuid } from 'uuid'


function CandidateDetails({ match }) {
	const id = match.params.id
	const history = useHistory()
	const tabLabels = ['Pipeline', 'Applied Jobs', 'Candidate Details']
	const tabIndex = useRecoilValue(candidateTab)
	const [checked, setChecked] = useRecoilState(candidateCheckedAtom)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const toggleModal = () => setIsModalOpen(!isModalOpen)
	const currentUser = useRecoilValue(currentUserAtom)

	const deleteHandler = async () => {
		try {
			await axios.delete(`${candidateEndpoint}/${id}`, {
				withCredentials: true,
			})
			history.goBack()
			toast.success('Candidate Deleted')
		} catch (e) {
			toast.error('Something went wrong')
		}
	}

	const candidates = useRecoilValue(candidateAtom)
	const [candidate, setCandidate] = useRecoilState(candidateAtom)

	const singleCandidate = candidates
		? candidates.find((candidate) => candidate.candidateCode === id)
		: candidate

	useEffect(() => {
		axios.get(`${candidateEndpoint}/${id}`, { withCredentials: true })
			.then(({ data }) => {
				setCandidate(data)
			})
			.catch((e) => console.log(e))
	}, [])

	const navHandler = () => {
		history.push(`/candidate/edit/${id}`)
	}

	const assignHandler = () => {
		setChecked({ [singleCandidate._id]: true })
		history.push('/job/apply')
	}

	const headings = ['Job Code', 'Job Title', 'Openings', 'Status', 'Posted on']
	const renderHeading = headings.map((heading) => (
		<TableHead key={uuid()}>{heading}</TableHead>
	))
	const renderData = get(singleCandidate, 'statusIds', []).map((status) => {
		return (
			<TableRow key={status._id}>
				<TableData>{status.jobId.jobDetails.jobCode}</TableData>
				<TableData>{status.jobId.jobOpeningInfo.jobTitle}</TableData>
				<TableData>{status.jobId.jobOpeningInfo.noOfOpenings}</TableData>
				<TableData>{status.currentStage.stageName}</TableData>
				<TableData>{formatDate(status.jobId.createdAt)}</TableData>
			</TableRow>
		)
	})

	const stageDataCount = counter(
		get(singleCandidate, 'statusIds', []).map(
			(statusId) => statusId.currentStage.stageName
		)
	)

	const renderPipeline = stages.map((stage) => {
		return (
			<PipelineCard key={uuid()}>
				<PipelineStat>{get(stageDataCount, stage, 0)}</PipelineStat>
				<PipelineTitle>{stage}</PipelineTitle>
			</PipelineCard>
		)
	})

	const renderTabBody = (index) => {
		switch (index) {
			case 0:
				return <PipelineContainer>{renderPipeline}</PipelineContainer>
			case 1:
				return (
					<>
						{renderWithLoader(
							singleCandidate,
							<Table headings={renderHeading}>{renderData}</Table>
						)}
					</>
				)

			case 2:
				return <CandidateInfo data={singleCandidate} />
			default:
				break
		}
	}

	return (
		<>
			<Controls title={get(singleCandidate, 'basic.fullName', 'Loading..')}>
				{get(currentUser, 'roleId.permissions.candidate.delete') && (
					<IconButton onClick={toggleModal} color='secondary'>
						<Delete />
					</IconButton>
				)}
				{get(currentUser, 'roleId.permissions.candidate.update') && (
					<ControlButton
						onClick={assignHandler}
						color='primary'
						variant='contained'>
						Assign
					</ControlButton>
				)}
				{get(currentUser, 'roleId.permissions.candidate.update') && (
					<ControlButton
						onClick={navHandler}
						color='primary'
						variant='contained'>
						Edit
					</ControlButton>
				)}
			</Controls>
			<DeleteModal
				open={isModalOpen}
				onClose={toggleModal}
				count={1}
				deleteHandler={deleteHandler}
			/>
			<ContentContainer>
				<PageTab atom={candidateTab} labels={tabLabels} />
				{renderTabBody(tabIndex)}
			</ContentContainer>
		</>
	)
}

export default CandidateDetails
