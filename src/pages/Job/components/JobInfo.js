import React from 'react'
import styled from 'styled-components'
import {
	Card,
	Category,
	CategoryGrid,
	CategoryMainTitle,
	CategoryTitle,
	Content,
	DataContainer,
	DataContent,
	DataTitle,
	themeBorder,
	Title,
} from '../../../styles'
import JobDetails from '../JobDetails'
import { v4 as uuid } from 'uuid'
import { formatDate } from '../../../utils/helperFunctions'

function JobInfo({ job }) {
	const { companyDetails, jobAddress, jobDetails, jobOpeningInfo } = job || {}
	const { companyName, companyAddress } = companyDetails || {}
	const { city, country, jobLocation, pincode, state, zone } = jobAddress || {}
	const {
		eligibility,
		responsibilities,
		benefits,
		jobCode,
		additionalInformation,
		jobDescription,
		targetDate,
	} = jobDetails || {}

	const { assignedOn, industry, jobTitle, jobType, noOfOpenings } =
		jobOpeningInfo || {}

	const renderList = (arr) =>
		arr.map((item) => {
			return (
				<DataContainer key={uuid()}>
					<Content>{item}</Content>
				</DataContainer>
			)
		})

	return (
		<Card>
			<Category>
				<CategoryMainTitle>Job Opening Info</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Job Title</Title>
						<Content>{jobTitle}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Job Type</Title>
						<Content>{jobType}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Industry</Title>
						<Content>{industry}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Openings</Title>
						<Content>{noOfOpenings}</Content>
					</DataContainer>
				</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>Job Address</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Job Location</Title>
						<Content>{jobLocation}</Content>
					</DataContainer>

					<DataContainer>
						<Title>City</Title>
						<Content>{city}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Zone</Title>
						<Content>{zone}</Content>
					</DataContainer>

					<DataContainer>
						<Title>State</Title>
						<Content>{state}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Pincode</Title>
						<Content>{pincode}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Country</Title>
						<Content>{country}</Content>
					</DataContainer>
				</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>Job Details</CategoryMainTitle>
				<CategoryGrid>
					<DataContainer>
						<Title>Job Code</Title>
						<Content>{jobCode}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Job Description</Title>
						<Content>{jobDescription}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Additional Information</Title>
						<Content>{additionalInformation}</Content>
					</DataContainer>

					<DataContainer>
						<Title>Target Date</Title>
						<Content>{formatDate(targetDate)}</Content>
					</DataContainer>
				</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>Eligibility</CategoryMainTitle>
				<CategoryGrid>{renderList(eligibility)}</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>Responsibility</CategoryMainTitle>
				<CategoryGrid>{renderList(responsibilities)}</CategoryGrid>
			</Category>

			<Category>
				<CategoryMainTitle>Benifits</CategoryMainTitle>
				<CategoryGrid>{renderList(benefits)}</CategoryGrid>
			</Category>
		</Card>
	)
}

export default JobInfo
