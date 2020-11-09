import React from 'react'
import { Pie } from 'react-chartjs-2'

import styled from 'styled-components'

function PieChart({ labels, data }) {
	const chartData = {
		datasets: [
			{
				data,
				backgroundColor: ['#007bff', '#FFA500'],
			},
		],
		labels,
	}

	return (
		<ChartContainer>
			<Pie data={chartData} />
		</ChartContainer>
	)
}

export default PieChart

const ChartContainer = styled.div`
	/* width: 400px; */
`
