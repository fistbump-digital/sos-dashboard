import { Button } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import axios from 'axios'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { logoutEndpoint } from '../api'
import { currentUserAtom, isAuthAtom } from '../recoil/atoms'
import { RemoveSpaces, themeBorder } from '../styles/index'
import { toast } from './Toast'

function Navbar() {
	const [anchorEl, setAnchorEl] = useState(null)
	const [, setIsAuth] = useRecoilState(isAuthAtom)
	const currentUser = useRecoilValue(currentUserAtom)

	const history = useHistory()
	const handleClick = (event) => setAnchorEl(event.currentTarget)
	const handleClose = () => setAnchorEl(null)

	const navHandler = () => {
		history.push(`/profile`)
		handleClose()
	}

	const logoutHandler = async () => {
		try {
			await axios.post(logoutEndpoint, {}, { withCredentials: true })
			setIsAuth(false)
			handleClose()
			history.push(`/`)
		} catch (e) {
			toast.error('Something went wrong')
		}
	}

	return (
		<NavbarContainer>
			<Logo>
				Switch <LogoHighlight>On Success</LogoHighlight>
			</Logo>

			<Button startIcon={<AccountCircleOutlinedIcon />} onClick={handleClick}>
				{currentUser && currentUser.firstName}
			</Button>

			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}>
				<MenuItem onClick={navHandler}>Profile</MenuItem>
				<MenuItem onClick={logoutHandler}>Logout</MenuItem>
			</Menu>
		</NavbarContainer>
	)
}

export default Navbar

const NavbarContainer = styled.div`
	display: flex;
	align-items: center;
	position: sticky;
	padding: 10px 20px;
	${themeBorder}
	border-radius: 0px;
	justify-content: space-between;
`
const Logo = styled.h4`
	${RemoveSpaces};
	color: blue;
`

const LogoHighlight = styled.span`
	color: orange;
`
