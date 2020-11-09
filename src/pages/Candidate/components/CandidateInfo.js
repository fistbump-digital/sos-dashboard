import React from 'react'
import { Card, Category, CategoryGrid, CategoryMainTitle, Content, DataContainer, RemoveSpaces, Title } from '../../../styles'
import styled from 'styled-components'
import { get } from 'lodash'
import { formatDate } from '../../../utils/helperFunctions'
import { v4 as uuid } from 'uuid'

function CandidateInfo({ data }) {
	const { basic, professional, address, source } = data || {}
	const { fullName, primaryEmail, secondaryEmail, mobile, pan, dateOfBirth } =
		basic || {}

	
	const {
		experience,
		education,
		skillSet,
		currentSalary,
		expected,
		industry,
		functionalArea,
	} = professional || {}

	const { streetName, state, country, pincode } = address || {}

	const renderExperience =
		experience &&
		experience.map(({ jobTitle, company, summary, fromDate, tillDate }) => {
			return (
				<CategoryGrid key={uuid()}>
					<DataContainer>
						<Title>Job Title</Title>
						<Content>{jobTitle}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Company</Title>
						<Content>{company}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Summary</Title>
						<Content>{summary}</Content>
					</DataContainer>

					<DataContainer>
						<Title>From Date</Title>
						<Content>{formatDate(fromDate)}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Till Date</Title>
						<Content>{formatDate(tillDate)}</Content>
					</DataContainer>
				</CategoryGrid>
			)
		})

	const renderSkill =
		skillSet &&
		skillSet.map((skill) => {
			return (
				<DataContainer key={uuid()}>
					<Content>{skill}</Content>
				</DataContainer>
			)
		})
	const renderEducation =
		education &&
		education.map(
			({
				qualificationName,
				instituteName,
				studiedFromDate,
				studiedTillDate,
			}) => {
				return (
					<CategoryGrid key={uuid()}>
						<DataContainer>
							<Title>Qualification</Title>
							<Content>{qualificationName}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Institute</Title>
							<Content>{instituteName}</Content>
						</DataContainer>

						<DataContainer>
							<Title>Start Date</Title>
							<Content>{formatDate(studiedFromDate)}</Content>
						</DataContainer>
						<DataContainer>
							<Title>End Date</Title>
							<Content>{formatDate(studiedTillDate)}</Content>
						</DataContainer>
					</CategoryGrid>
				)
			}
		)

	return (
		<Card>
			<Category>
				<CategoryMainTitle>Basic</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Fullname</Title>
						<Content>{fullName}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Primary Email</Title>
						<Content>{primaryEmail}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Secondary Email</Title>
						<Content>{secondaryEmail}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Mobile</Title>
						<Content>{mobile}</Content>
					</DataContainer>
					<DataContainer>
						<Title>PAN Number</Title>
						<Content>{pan}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Date Of Birth</Title>
						<Content>{formatDate(dateOfBirth)}</Content>
					</DataContainer>
				</CategoryGrid>
			</Category>
			<Category>
				<CategoryMainTitle>Address</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Street Name</Title>
						<Content>{streetName}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Pincode</Title>
						<Content>{pincode}</Content>
					</DataContainer>
					<DataContainer>
						<Title>State</Title>
						<Content>{state}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Country</Title>
						<Content>{country}</Content>
					</DataContainer>
				</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>SkillSet</CategoryMainTitle>
				<CategoryGrid>{renderSkill}</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>Professional</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Industry</Title>
						<Content>{industry}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Functional Area</Title>
						<Content>{functionalArea}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Current Salary</Title>
						<Content>{currentSalary}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Expected Salary</Title>
						<Content>{expected}</Content>
					</DataContainer>
				</CategoryGrid>
				{renderExperience}
			</Category>

			<Category>
				<CategoryMainTitle>Education</CategoryMainTitle>
				{renderEducation}
			</Category>
		</Card>
	)
}

export default CandidateInfo


