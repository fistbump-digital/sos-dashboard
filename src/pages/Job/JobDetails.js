import axios from 'axios'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import styled from 'styled-components'
import { jobEndpoint } from '../../api'
import ArrowBG from '../../assets/icons/arrow.svg'
import Controls from '../../components/Controls'
import DeleteModal from '../../components/Modals/DeleteModal'
import PageTab from '../../components/PageTab'
import Table from '../../components/Table'
import { currentUserAtom, jobAtom, jobTab, singlejobAtom } from '../../recoil/atoms'

import {
	Card,
	ContentContainer,
	ControlButton,
	PipelineCard,
	PipelineContainer,
	PipelineStat,
	PipelineTitle,
	RemoveSpaces,
	TableData,
	TableHead,
	TableRow,
} from '../../styles'
import IconButton from '@material-ui/core/IconButton';
import { counter, renderWithLoader } from '../../utils/helperFunctions'
import { stages } from '../../utils/sharedVariables'
import JobInfo from './components/JobInfo'
import { toast } from '../../components/Toast'
import { v4 as uuid } from 'uuid'

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import NewJobInfo from './components/NewJobInfo'
import AppliedCandidatesTable from './components/AppliedCandidatesTable'
import Logs from './components/Logs'


function JobDetails({ match }) {
	const history = useHistory()
	const id = match.params.id
	const jobTabIndex = useRecoilValue(jobTab)
	const labels = ['PipeLine', 'Applied Candidates', 'Job Details', 'Logs']
	const [job, setJob] = useRecoilState(singlejobAtom)
	const jobFullData = useRecoilValue(jobAtom)
	const currentUser = useRecoilValue(currentUserAtom)

	const selectedJob = jobFullData
		? jobFullData.find((job) => job.jobCode === id)
		: job

	const stageDataCount = counter(
		get(selectedJob, 'statusIds', []).map(
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

	const [isModalOpen, setIsModalOpen] = useState(false)
	const toggleModal = () => setIsModalOpen(!isModalOpen)

	useEffect(() => {
		axios
			.get(`${jobEndpoint}/${id}`, { withCredentials: true })
			.then(({ data }) => {
				setJob(data)
			})
			.catch((e) => console.log(e))
	}, [])

	const candidateData = get(selectedJob, 'statusIds', []).map(
		(item) => item.candidateId
	)

	const deleteHandler = async () => {
		try {
			await axios.delete(`${jobEndpoint}/${id}`, { withCredentials: true })
			toggleModal()
			toast.success('Job Deleted')

			history.goBack()
		} catch (err) {
			toggleModal()
			toast.error(`Error: ${err.message}`)
		}
	}

	const editNavHandler = () => {
		history.push(`/job/edit/${id}`)
	}

	const candidateHeading = [
		'Candidate Code',
		'Name',
		'Email',
		'Mobile',
		'City',
		// `Experience`,
		`Industry`,
		`Functional Area`,
		'Status',
	]

	const renderCandidateHeading = candidateHeading.map((heading) => (
		<TableHead key={uuid()}>{heading}</TableHead>
	))

	const renderCandidateData = get(selectedJob, 'statusIds', []).map(
		({ candidateId, currentStage, _id }) => {
			return (
				<TableRow key={candidateId._id}>
					<TableData>
						<NavLink to={`/applied/${_id}`}>
							{candidateId.candidateCode}
						</NavLink>
					</TableData>
					<TableData>{candidateId.basic.fullName}</TableData>
					<TableData>{candidateId.basic.primaryEmail}</TableData>
					<TableData>{candidateId.basic.mobile}</TableData>
					<TableData>{candidateId.address.state}</TableData>
					{/* <TableData>45</TableData> */}
					<TableData>{candidateId.professional.industry}</TableData>
					<TableData>{candidateId.professional.functionalArea}</TableData>
					<TableData>{currentStage.stageName}</TableData>
				</TableRow>
			)
		}
	)

	const renderTabBody = (index) => {
		switch (index) {
			case 0:
				return (
					job ? 
					<PipelineContainer>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.shortlisted.length}</PipelineStat>
							<PipelineTitle>Shortlisted</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.assessment.length}</PipelineStat>
							<PipelineTitle>Assessment</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.hiringManagerReview.length}</PipelineStat>
							<PipelineTitle>Hiring Manager Review</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.interview.length}</PipelineStat>
							<PipelineTitle>Interview</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.salaryFitment.length}</PipelineStat>
							<PipelineTitle>Salary Fitment</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.offer.length}</PipelineStat>
							<PipelineTitle>Offer</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.documentation.length}</PipelineStat>
							<PipelineTitle>Documentation</PipelineTitle>
						</PipelineCard>
						<PipelineCard key={uuid()}>
							<PipelineStat>{job.candidates.joining.length}</PipelineStat>
							<PipelineTitle>Joining</PipelineTitle>
						</PipelineCard>
					</PipelineContainer>
					: null
				)
			case 1:
				return <AppliedCandidatesTable match={match} data={job} />

			case 2:
				// return <JobInfo job={selectedJob} />
				return <NewJobInfo data={selectedJob} />

			case 3: return <Logs data={job} match={match} />

			default:
				break
		}
	}

	return (
		<>
			<Controls
				title={get(selectedJob, 'jobTitle', 'Loading..')}>
				{/* <Controls title='Details'> */}
				{get(currentUser, 'roleId.permissions.job.delete') && (
					<IconButton onClick={toggleModal}>
						<DeleteIcon />
					</IconButton>
				)}
				{get(currentUser, 'roleId.permissions.job.update') && (
					<IconButton
						onClick={editNavHandler}>
						<EditIcon />
					</IconButton>
				)}
			</Controls>

			<ContentContainer>
				<DeleteModal
					open={isModalOpen}
					onClose={toggleModal}
					count={1}
					deleteHandler={deleteHandler}
				/>
				<PageTab atom={jobTab} labels={labels} />
				{renderTabBody(jobTabIndex)}
			</ContentContainer>
		</>
	)
}

export default JobDetails
