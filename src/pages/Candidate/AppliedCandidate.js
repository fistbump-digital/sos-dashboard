import { MenuItem } from '@material-ui/core'
import axios from 'axios'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { candidateEndpoint, statusEndpoint } from '../../api'
import Controls from '../../components/Controls'
import PageTab from '../../components/PageTab'
import {
	appliedCandidateTabAtom,
	candidateAtom,
	currentUserAtom,
	statusAtom,
} from '../../recoil/atoms'

import { Card, ContentContainer, ControlButton } from '../../styles'
import { SMUISelect } from '../../styles/StyledMaterialUI'
import { formatDate } from '../../utils/helperFunctions'
import { stages } from '../../utils/sharedVariables'
import CandidateInfo from './components/CandidateInfo'
import { toast } from '../../components/Toast'
import { v4 as uuid } from 'uuid'


function AppliedCandidate({ match }) {
	const { id } = match.params

	const history = useHistory()
	const tabIndex = useRecoilValue(appliedCandidateTabAtom)
	const currentUser = useRecoilValue(currentUserAtom)
	const [status, setStatus] = useRecoilState(statusAtom)
	const [selectedStage, setSelectedStage] = useState(newStageGenerator()[0])

	const candidates = useRecoilValue(candidateAtom)
	const [candidate, setCandidate] = useState()
	const { candidateId } = status || {}
	const singleCandidate = () =>
		candidates
			? candidates.find((candidate) => candidate._id.toString() === candidateId)
			: candidate

	//new stage --> stages
	//Current stage -> new stage

	useEffect(() => {
		axios.get(`${statusEndpoint}/${id}`, { withCredentials: true })
			.then(({ data }) => setStatus(data))
			.catch((e) => console.log(e))

		axios.get(`${candidateEndpoint}/${candidateId}`, { withCredentials: true })
			.then(({ data }) => setCandidate(data))
			.catch((e) => console.log(e))
		// setSelectedStage(get(status, 'currentStage.stageName', ''))
	}, [candidateId])

	const changeStageHangler = async () => {
		try {
			await axios.patch(
				`${statusEndpoint}/${id}`,
				{
					stageName: selectedStage,
					userId: currentUser._id,
				},
				{ withCredentials: true }
			)
			history.goBack()
			toast.success('Candidate Stage Change')
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	const tabLabels = ['Timeline', 'Candidate Details']

	const renderTimelineData = get(status, 'stages', []).map(
		({ stageName, createdAt, userId }) => {
			return (
				<TimelineEvent
					key={uuid()}
					title={`${stageName} set by ${userId.firstName} ${userId.lastName}`}
					createdAt={formatDate(createdAt)}></TimelineEvent>
			)
		}
	)

	const renderTabBody = (index) => {
		switch (index) {
			case 0:
				return (
					<Card>
						<Timeline>{renderTimelineData}</Timeline>
					</Card>
				)
			case 1:
				return <CandidateInfo data={singleCandidate()} />
			default:
				break
		}
	}

	// const renderStageOption =
	// 	status &&
	// 	stages
	// 		.filter((stage) => stage !== status.currentStage.stageName)
	// 		.map((stage) => {
	// 			return <MenuItem value={stage}>{stage}</MenuItem>
	// 		})

	function newStageGenerator() {
		const currentStatus = status && status.currentStage.stageName
		const index = stages.indexOf(currentStatus)
		const newStages = stages.slice(index + 1)
		return newStages
	}

	const renderStageOption = newStageGenerator().map((stage) => {
		return <MenuItem key={uuid()} value={stage}>{stage}</MenuItem>
	})

	return (
		<>
			<Controls title='Candidate'>
				<SMUISelect
					value={selectedStage}
					onChange={(e) => setSelectedStage(e.target.value)}>
					{renderStageOption}
				</SMUISelect>
				<ControlButton
					onClick={changeStageHangler}
					variant='contained'
					color='primary'>
					Set
				</ControlButton>
			</Controls>
			<ContentContainer>
				<PageTab atom={appliedCandidateTabAtom} labels={tabLabels} />
				{renderTabBody(tabIndex)}
			</ContentContainer>
		</>
	)
}

export default AppliedCandidate
