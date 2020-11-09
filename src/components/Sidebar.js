import { get } from 'lodash'
import React from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { v4 as uniqueID } from 'uuid'
import CandidateIcon from '../assets/icons/candidate.svg'
import CompanyIcon from '../assets/icons/company.svg'
import DashboardIcon from '../assets/icons/dashboard.svg'
import JobIcon from '../assets/icons/job.svg'
import RoleIcon from '../assets/icons/role.svg'
import UserIcon from '../assets/icons/user.svg'
import { currentUserAtom } from '../recoil/atoms'
import { StyledNavlink } from '../styles'



function Sidebar() {
	const currentUser = useRecoilValue(currentUserAtom)
	const { roleId } = currentUser || {}
	const { permissions } = roleId || {}

	// const { job, candidate, role, user } = permissions || {}


	const activeLinkStyle = {
		color: '#0168fa',
		backgroundColor: '#EEF0F7',
		fontWeight: '500',
		boxShadow: 'inset 1px 1px 3px 0px #016afa2e',
	}


	return (
		<SidebarContainer>
			<MenuItem key={uniqueID()}>
				<StyledNavlink activeStyle={activeLinkStyle} to='/dashboard'>
					<NavIcon src={DashboardIcon} />
					Dashboard
				</StyledNavlink>
			</MenuItem>

			{get(permissions, 'job.read') && (
				<MenuItem key={uniqueID()}>
					<StyledNavlink activeStyle={activeLinkStyle} to='/job'>
						<NavIcon src={JobIcon} />
						Job
					</StyledNavlink>
				</MenuItem>
			)}

			{get(permissions, 'candidate.read') && (
				<MenuItem key={uniqueID()}>
					<StyledNavlink activeStyle={activeLinkStyle} to='/candidate'>
						<NavIcon src={CandidateIcon} />
						Candidate
					</StyledNavlink>
				</MenuItem>
			)}

			{get(permissions, 'job.read') && (
				<MenuItem key={uniqueID()}>
					<StyledNavlink activeStyle={activeLinkStyle} to='/company'>
						<NavIcon src={CompanyIcon} />
						Company
					</StyledNavlink>
				</MenuItem>
			)}

			{get(permissions, 'role.read') && (
				<MenuItem key={uniqueID()}>
					<StyledNavlink activeStyle={activeLinkStyle} to='/role'>
						<NavIcon src={RoleIcon} />
						Role
					</StyledNavlink>
				</MenuItem>
			)}

			{get(permissions, 'user.read') && (
				<MenuItem key={uniqueID()}>
					<StyledNavlink activeStyle={activeLinkStyle} to='/user'>
						<NavIcon src={UserIcon} />
						User
					</StyledNavlink>
				</MenuItem>
			)}
		</SidebarContainer>
	)
}

export default Sidebar

const SidebarContainer = styled.ul`
	background-color: white;
	list-style: none;
	margin: 0px;
	padding: 0px;
	border: 1px solid #0000003b;
	border-top: 0px;
	padding: 10px;
	text-align: left;
	/* overflow-y: scroll; */
`

const MenuItem = styled.li``

const NavIcon = styled.img`
	margin-right: 10px;
`
