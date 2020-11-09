import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { Card } from '../styles'

function ChartSkeleton() {
	return (
		<ChartCard>
			<TitleContainer>
				<Skeleton width={100} />
				<Skeleton width={100} />
			</TitleContainer>
			<Skeleton circle={true} height={200} width={200} />
			<Skeleton width={300} />
		</ChartCard>
	)
}

export default ChartSkeleton

const ChartCard = styled(Card)`
	flex: 1;
	margin: 10px;
	padding: 20px;
`

const TitleContainer = styled.div`
	display: flex;
	justify-content: space-evenly;
`
