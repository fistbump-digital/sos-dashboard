import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { useRecoilState } from 'recoil'
import { Card } from '../styles'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'


export default function PageTab({ atom, labels }) {
	const [value, setValue] = useRecoilState(atom)

	const handleChange = (_event, newValue) => {
		setValue(newValue)
	}

	const renderLabels = labels.map((item) => <Tab key={uuid()} label={item} />)
	return (
		<TabBG>
			<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor='primary'
				textColor='primary'
				// centered
			>
				{renderLabels}
			</Tabs>
		</TabBG>
	)
}

const TabBG = styled(Card)`
	padding: 0px;
	margin: 0px;
	width: fit-content;
`
