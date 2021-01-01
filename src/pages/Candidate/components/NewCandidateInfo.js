import React from 'react'
import { Card, Category, CategoryGrid, CategoryMainTitle, Content, DataContainer, RemoveSpaces, Title } from '../../../styles'
import styled from 'styled-components'
import { get } from 'lodash'
import { formatDate } from '../../../utils/helperFunctions'
import { v4 as uuid } from 'uuid'
import { EmailRounded } from '@material-ui/icons'

function CandidateInfo({ data }) {
        const {
          candidateName,
          contactNo,
          email,
          DOB,
          postalAddress,
          resumeTitle,
          resumeID,
          workExp,
          annualSalary,
          currentLocation,
          preferredLocation,
          currentEmployer,
          designation,
          PGCourse,
          UGCourse,
          postPGCourse,
	  lastActiveDate,
	  commentOne,
	  commentTwo,
	  commentThree,
	  commentFour,
	  commentFive
	} = data || {};

	return (
		<Card>
			<Category>
				<CategoryMainTitle>Personal</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Name</Title>
						<Content>{candidateName}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Contact Number</Title>
						<Content>{contactNo}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Email</Title>
						<Content><a href={`mailto:${email}`} target="_blank">{email}</a></Content>
					</DataContainer>
					<DataContainer>
						<Title>Date Of Birth</Title>
						<Content>{DOB}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Postal Address</Title>
						<Content>{postalAddress}</Content>
					</DataContainer>
				</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>Professional</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Resume Title</Title>
						<Content>{resumeTitle}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Resume ID</Title>
						<Content>{resumeID}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Work Experience</Title>
						<Content>{workExp}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Annual Salary</Title>
						<Content>{annualSalary}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Current Location</Title>
						<Content>{currentLocation}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Preferred Location</Title>
						<Content>{preferredLocation}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Current Employer</Title>
						<Content>{currentEmployer}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Designation</Title>
						<Content>{designation}</Content>
					</DataContainer>
				</CategoryGrid>
				{}
			</Category>

			<Category>
				<CategoryMainTitle>Education</CategoryMainTitle>
                                <CategoryGrid>
                                        <DataContainer>
                                                <Title>U.G. Course</Title>
                                                <Content>{UGCourse}</Content>
                                        </DataContainer>
                                        <DataContainer>
                                                <Title>P.G. Course</Title>
                                                <Content>{PGCourse}</Content>
                                        </DataContainer>
                                        <DataContainer>
						<Title>Post P.G. Course</Title>
						<Content>{postPGCourse}</Content>
					</DataContainer>
                                </CategoryGrid>
			</Category>
			<Category>
				<CategoryMainTitle>General</CategoryMainTitle>
                                <CategoryGrid>
                                        <DataContainer>
						<Title>Last Active Date</Title>
						<Content>{lastActiveDate}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Comment 1</Title>
						<Content>{commentOne}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Comment 2</Title>
						<Content>{commentTwo}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Comment 3</Title>
						<Content>{commentThree}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Comment 4</Title>
						<Content>{commentFour}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Comment 5</Title>
						<Content>{commentFive}</Content>
					</DataContainer>
                                </CategoryGrid>
			</Category>
		</Card>
	)
}

export default CandidateInfo


