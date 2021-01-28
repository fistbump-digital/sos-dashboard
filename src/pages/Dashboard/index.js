import React, { useEffect } from 'react'
import PieChart from '../../components/PieChart'
import { Card, ContentContainer, PageLayout, Title } from '../../styles'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'
import { statsAtom } from '../../recoil/atoms'
import axios from 'axios'
import { statsEndpoint } from '../../api'
import { toast } from '../../components/Toast'
import Skeleton from 'react-loading-skeleton'
import ChartSkeleton from '../../components/ChartSkeleton'

function DashboardPage() {
	const [stats, setStats] = useRecoilState(statsAtom)
	useEffect(() => {
		axios
			.get(`${statsEndpoint}/`, { withCredentials: true })
			.then(({ data }) => setStats(data))
			.catch((e) => toast.error(`Error: ${e.message}`))
	}, [])

	console.log({ stats })

	return (
		<>
			<ContentContainer>
				<PieContainer>
					{stats ? (
						<>
							<ChartCard>
								<PieChart
									labels={['Assigned Jobs', 'Unassigned Jobs']}
									data={[stats.stats.job.assigned, stats.stats.job.unassigned]}
								/>
								<ChartTitle>{stats.stats.job.total} Jobs</ChartTitle>
							</ChartCard>
							<ChartCard>
								<PieChart
									labels={['Applied Candidates', 'Candidates Not Applied']}
									data={[
										stats.stats.candidate.applied,
										stats.stats.candidate.unapplied,
									]}
								/>
								<ChartTitle>
									{stats.stats.candidate.total} Candidates
								</ChartTitle>
							</ChartCard>
						</>
					) : (
						<>
							<ChartSkeleton />
							<ChartSkeleton />
						</>
					)}
				</PieContainer>
			</ContentContainer>
		</>
	)
}

export default DashboardPage

const PieContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

const ChartTitle = styled.h3`
	color: #333;
`
const ChartCard = styled(Card)`
	flex: 1;
	margin: 10px;
	padding: 20px;
`
