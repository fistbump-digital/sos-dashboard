import React from 'react'
import { useRecoilState } from 'recoil'
import styled, { css } from 'styled-components'
import { jobsAtom } from '../recoil/atoms'

function Card({ id, title, body }) {
	const [data, setData] = useRecoilState(jobsAtom)

	const deleteHandler = () => {
		const dataTemp = [...data]
		const filtered = dataTemp.filter((item) => item.id !== id)
		setData(filtered)
	}

	return (
		<CardContainer onClick={deleteHandler}>
			<h1 style={{ textAlign: 'left' }}>{id}</h1>
			<Title>{title}</Title>
			<Paragraph>{body}</Paragraph>
		</CardContainer>
	)
}

export default Card

const common = css`
	color: #333;
	text-align: left;
	padding: 0px;
	margin: 0px;
`

const CardContainer = styled.div`
	padding: 40px;
	box-shadow: 6px 5px 20px 1px #0000001a;
	margin: 20px;
	cursor: pointer;
	/* width: 40%; */
`

const Title = styled.h2`
	${common};
	padding-bottom: 20px;
`

const Paragraph = styled.p`
	${common}
`
