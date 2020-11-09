import styled from 'styled-components'
import {
	Button,
	FormControl,
	IconButton,
	Modal,
	Select,
	TextField,
} from '@material-ui/core'

export const SMUIButton = styled(Button)`
	&& {
		margin: 10px;
		padding: 5px 20px;
	}
`
export const SMUITextField = styled(TextField)`
	&& {
		margin: 10px 0px;
		width: 100%;
	}
`
export const SMUISelect = styled(Select)`
	&& {
		width: 100%;
		/* margin: 10px 0px; */
		/* padding: 5px 0px; */

		text-align: left;
	}
`
export const SMUIFormControl = styled(FormControl)`
	&& {
		width: 100%;
		margin: 10px 0px;
		text-align: left;
	}
`
export const SMUIIconButton = styled(IconButton)`
	&&{
		padding: 0px;
	}
`

export const SMUIModal = styled(Modal)`
	&& {
		position: fixed;
		top: auto;
		bottom: auto;
		left: auto;
		margin: 0 auto;
		right: auto;
		width: 500px;
		outline: none;
		border-style: none;
	}
	&&:focus {
		outline: none;
	}
`
