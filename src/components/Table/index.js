import React from 'react'
import styled from 'styled-components'
import { themeBorder } from '../../styles'

function Table({ headings, children }) {
	return (
		<TableContainer>
			<TableHeadContainer>
				<TableHeadingRow>{headings}</TableHeadingRow>
			</TableHeadContainer>
			<TableBody>{children}</TableBody>
		</TableContainer>
	)
}

export default Table

const TableHeadingRow = styled.tr`
	background-color: #eef0f7;
	color: #eee;
`

const TableContainer = styled.table`
	padding: 5px;
	border: 0;
	width: 100%;
	background-color: white;
	/* box-shadow: 2px 3px 20px 0px #00000017; */
	/* border-collapse: collapse; */
	overflow: scroll;
	/* ${themeBorder}; */
	box-shadow: 3px 3px 5px 0px #00000017;
`

const TableBody = styled.tbody``

const TableHeadContainer = styled.thead``
