import React from 'react'
import Table from './Table'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { TableData, TableHead, TableRow } from '../styles'
import { v4 as uuid } from 'uuid'

function TableSkeletonLoader() {
	let renderTableHeading = []
	let renderTableBody = []

	const loopHead = (limit) => {
		for (let i = 0; i < limit; i++) {
			renderTableHeading.push(
				<TableHead key={uuid()}>
					<Skeleton />
				</TableHead>
			)
		}
	}

	const loopBody = (limit) => {
		for (let i = 0; i < limit; i++) {
			renderTableBody.push(
				<TableRow key={i}>
					<TableData>
						<Skeleton />
					</TableData>
					<TableData>
						<Skeleton />
					</TableData>
					<TableData>
						<Skeleton />
					</TableData>
					<TableData>
						<Skeleton />
					</TableData>
					<TableData>
						<Skeleton />
					</TableData>
					<TableData>
						<Skeleton />
					</TableData>
				</TableRow>
			)
		}
	}

	loopHead(6)
	loopBody(6)

	return <Table headings={renderTableHeading}>{renderTableBody}</Table>
}

export default TableSkeletonLoader
