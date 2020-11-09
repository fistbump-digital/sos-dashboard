import React from 'react'
import styled from 'styled-components'
import { RemoveSpaces } from '../styles'
import Search from '../components/Search'

function Controls({ title, children, onSearchChange, search }) {
	return (
		<ControlContainer>
			<ControlTitle>{title}</ControlTitle>
			{
				search ? <ControlSearch><Search onChange={onSearchChange} /></ControlSearch> : null
			}
			<ControlButtonContainer>{children}</ControlButtonContainer>
		</ControlContainer>
	)
}

export default Controls

const ControlContainer = styled.div`
	position: sticky;
	top: 0px;
	z-index: 10;
	padding: 10px 20px;
	background-color: white;
	display: flex;
	border: 1px solid #0000003b;
	border-top: none;
	border-left: none;
	/* border-radius: 6px; */
	align-items: center;
	justify-content: space-between;
`

const ControlTitle = styled.h4`
	${RemoveSpaces}
	color: #333;
`

const ControlSearch = styled.div`
	margin: 0 auto;	
`

const ControlButtonContainer = styled.div`
	display: flex;
`
