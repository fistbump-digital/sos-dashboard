import { IconButton, Tooltip } from '@material-ui/core'
import { Delete, PlaylistAdd, Edit } from '@material-ui/icons'
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
import AppliedJobsTable from './components/AppliedJobsTable'
import CandidateInfo from './components/CandidateInfo'
import NewCandidateInfo from './components/NewCandidateInfo'
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
		} catch (err) {
			toast.error(`Error: ${err.message}`)
		}
	}

	const [candidate, setCandidate] = useRecoilState(candidateAtom)


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
		setChecked({ [candidate._id]: true })
		history.push('/job/apply')
	}

	const headings = ['Job Code', 'Job Title', 'Openings', 'Status', 'Posted on']
	const renderHeading = headings.map((heading) => (
		<TableHead key={uuid()}>{heading}</TableHead>
	))
	const renderData = get(candidate, 'statusIds', []).map((status) => {
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

	// const stageDataCount = counter(
	// 	get(candidate, 'statusIds', []).map(
	// 		(statusId) => statusId.currentStage.stageName
	// 	)
	// ) 


	const renderPipeline = stages.map((stage) => {
		return (
			<PipelineCard key={uuid()}>
				<PipelineStat></PipelineStat>
				<PipelineTitle>{stage.name}</PipelineTitle>
			</PipelineCard>
		)
	})

	console.log(candidate)

	const renderTabBody = (index) => {
		switch (index) {
			case 0:
				// return <PipelineContainer>{renderPipeline}</PipelineContainer>
				return (
					<PipelineContainer>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.shortlisted.length}</PipelineStat>
							<PipelineTitle>Shortlisted</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.assessment.length}</PipelineStat>
							<PipelineTitle>Assessment</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.hiringManagerReview.length}</PipelineStat>
							<PipelineTitle>Hiring Manager Review</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.interview.length}</PipelineStat>
							<PipelineTitle>Interview</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.salaryFitment.length}</PipelineStat>
							<PipelineTitle>Salary Fitment</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.offer.length}</PipelineStat>
							<PipelineTitle>Offer</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.documentation.length}</PipelineStat>
							<PipelineTitle>Documentation</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{candidate.jobs.joining.length}</PipelineStat>
							<PipelineTitle>Joining</PipelineTitle>
						</PipelineCard>
					</PipelineContainer>
				)
			case 1:
				return <AppliedJobsTable match={match} data= {candidate} />
				

			case 2:
				return <NewCandidateInfo data={candidate} />
			default:
				break
		}
	}

	return (
		<>
			<Controls title={candidate ? candidate.candidateName : 'Loading...'}>
				{get(currentUser, 'roleId.permissions.candidate.delete') && (
					<Tooltip title='Delete'>
						<IconButton onClick={toggleModal}>
						<Delete />
					</IconButton>
					</Tooltip>
				)}
				{get(currentUser, 'roleId.permissions.candidate.update') && (
					<Tooltip title='Assign to jobs'>
						<IconButton onClick={assignHandler}>
							<PlaylistAdd />
						</IconButton>
					</Tooltip>
				)}
				{get(currentUser, 'roleId.permissions.candidate.update') && (
					<Tooltip title='Edit Candidate'>
						<IconButton>
							<Edit />
						</IconButton>
					</Tooltip>
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
