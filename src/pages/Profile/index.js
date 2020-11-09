import React from 'react'
import { useRecoilValue } from 'recoil'
import { currentUserAtom } from '../../recoil/atoms'
import {
	Card,
	CategoryMainTitle,
	Category,
	CategoryGrid,
	DataContainer,
	Title,
	Content,
} from '../../styles'
import { formatDate } from '../../utils/helperFunctions'

function ProfilePage() {
	const currentUser = useRecoilValue(currentUserAtom)
	const { firstName, lastName, userName, email, contact, roleId, createdAt } =
		currentUser || {}
	const { name } = roleId || {}

	return (
		<>
			<Card>
				<Category>
					<CategoryMainTitle>Profile</CategoryMainTitle>
					<CategoryGrid>
						<DataContainer>
							<Title>First Name</Title>
							<Content>{firstName}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Last Name</Title>
							<Content>{lastName}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Username</Title>
							<Content>{userName}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Email</Title>
							<Content>{email}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Contact</Title>
							<Content>{contact}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Role</Title>
							<Content>{name}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Created At</Title>
							<Content>{formatDate(createdAt)}</Content>
						</DataContainer>
					</CategoryGrid>
				</Category>
			</Card>
		</>
	)
}

export default ProfilePage
