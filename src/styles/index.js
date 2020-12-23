import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'
import {
	Button,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Modal
} from '@material-ui/core'

export const RemoveSpaces = css`
	margin: 0px;
	padding: 0px;
`

export const themeBorder = css`
	border: 1px solid #0000003b;
	border-radius: 6px;
`

export const MultipleItemInputContainer = styled.form`
	display: flex;
	align-items: center;
	width: 100%;
`

export const Card = styled.div`
	padding: 10px 20px;
	/* border-radius: 3px; */
	/* border: 1px solid #0000003b; */
	background-color: white;
	margin-bottom: 10px;
	box-shadow: 3px 3px 5px 0px #00000017;
`

export const CardTitle = styled.h5`
	text-align: left;
	color: #333;
	${RemoveSpaces};
	padding: 5px 0px;
`

export const StyledNavlink = styled(NavLink)`
	width: 150px;
	padding: 6px 10px;
	border-radius: 0.25rem;
	display: flex;
	align-items: center;
	color: black;
	text-decoration: none;
	font-weight: 400;
	&:focus {
		color: black;
	}
	&:hover {
		color: black;
	}
`

export const TableRow = styled.tr`
	/* cursor: pointer; */
	transition: all 0.5s;
	&:hover {
		background-color: #eef0f7;
	}
`

export const TableData = styled.td`
	border: 0;
	font-size: 0.9em;

	text-align: left;
	padding: 4px;

	border-bottom: 1px solid #00000021;
`

export const TableHead = styled.th`
	border: 0;
	font-size: 0.9em;

	text-align: left;
	padding: 4px;

	border-bottom: 1px solid #00000021;
	color: #000000c2;
`
export const PageLayout = styled.div`
	/* width: 100%; */
	padding: 10px;
`

export const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: flex-start;
`

export const CategoryContainer = styled.div``

export const CategoryTitle = styled.h3`
	${RemoveSpaces};
`

export const Label = styled.label``

export const StyledTextField = styled(TextField)`
	width: 100%;
	margin: 10px;
`

export const ItemListContainer = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	padding: 10px;
	border: 1px dashed #0000003b;
	background-color: #0000000d;
	border-radius: 6px;
	margin: 20px 0px;
	flex-flow: wrap;
`

export const ItemList = styled.li`
	margin: 5px;
	padding: 5px 10px;
	border-radius: 6px;
	background-color: white;
	border: 1px solid #0000003b;
`
export const DataTitle = styled.h5`
	text-align: left;
	${RemoveSpaces};
`

export const DataContent = styled.p`
	${RemoveSpaces};
	text-align: left;
`

export const ContentContainer = styled.div`
	padding: 10px;
`

export const IconButton = styled.img`
	width: 28px;
	cursor: pointer;
`

export const ControlButton = styled(Button)`
	&& {
		margin: 5px;
		padding: 2px 10px;
	}
`

export const StyledCheckbox = styled.input`
	width: 18px;
	height: 18px;
`

// Modal

export const ModalBody = styled.div`
	background-color: white;
	margin-top: 50px;
	padding: 20px;
	border-radius: 5px;
`
export const ModalTitle = styled.h4`
	${RemoveSpaces};
	padding-bottom: 10px;
`

export const ModalWarning = styled.p`
	${RemoveSpaces}
	padding: 10px;
	font-weight: bold;
	border: 2px solid red;
	border-radius: 5px;
	border-left: 10px solid red;
`

export const ModalText = styled.p`
	${RemoveSpaces};
	padding-top: 10px;
`

export const ModalButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
`

//Pipeline
export const PipelineContainer = styled(Card)`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	row-gap: 1em;
	padding: 50px;
`
export const PipelineCard = styled.div`
	display: flex;
	padding: 20px;
	align-items: center;
	justify-content: center;
	background-color: #4caf5029;
	margin: 0px;
	height: 50px;
	transition: all 0.3s;
	clip-path: polygon(90% 0, 100% 50%, 90% 100%, 0% 100%, 10% 50%, 0% 0%);

	&:hover {
		background-color: #ffc10726;
		transform: translateX(10px);
	}
`
export const PipelineTitle = styled.p`
	${RemoveSpaces};
	color: #333;
	font-weight: lighter;
	font-size: 1.25em;
`

export const PipelineStat = styled.p`
	${RemoveSpaces};
	padding-right: 10px;

	font-size: 2em;
	font-weight: bold;
	color: #333;
`

//
export const Category = styled.div`
	padding: 20px;
`

export const CategoryGrid = styled.div`
	display: grid;
	gap: 1em;
	grid-template-columns: repeat(2, 1fr);
	padding-bottom: 20px;
`

export const DataContainer = styled.div`
	text-align: left;
`
export const CategoryMainTitle = styled.h1`
	${RemoveSpaces};
	text-align: left;
	color: #333;
	font-size: 1.5em;
	padding-bottom: 15px;
`

export const Title = styled.h3`
	${RemoveSpaces};
	color: #333;
	font-size: 1em;
`

export const Content = styled.p`
	${RemoveSpaces};
	color: #333;
	font-size: 1.2em;
`
