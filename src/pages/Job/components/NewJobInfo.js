import React from 'react'
import styled from 'styled-components'
import { Card, Category, CategoryGrid, CategoryMainTitle, Content, DataContainer, RemoveSpaces, Title } from '../../../styles'
import { v4 as uuid } from 'uuid'
import { formatDate } from '../../../utils/helperFunctions'

const NewJobInfo = ({data}) => {
	const {jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink} = data || {}
	
        return (
                <Card>
                        <CategoryMainTitle>Job Info</CategoryMainTitle>
                        <CategoryGrid>
					<DataContainer>
						<Title>Job Code</Title>
						<Content>{jobCode}</Content>
					</DataContainer>
					<DataContainer>
						<Title>Job Title</Title>
						<Content>{jobTitle}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>State</Title>
						<Content>{state}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>District</Title>
						<Content>{district}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Zone</Title>
						<Content>{zone}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Status</Title>
						<Content>{status}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>No. of Opening</Title>
						<Content>{noOfOpening}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Start Date</Title>
						<Content>{formatDate(startDate)}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Close Date</Title>
						<Content>{formatDate(closeDate)}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Industry</Title>
						<Content>{industry}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Company</Title>
						<Content>{company}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Vertical</Title>
						<Content>{vertical}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Division</Title>
						<Content>{division}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>CTC Min</Title>
						<Content>{ctcMin}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>CTC Max</Title>
						<Content>{ctcMax}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>No. of CVs Shared</Title>
						<Content>{CVShared}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>Shared With HR Date</Title>
						<Content>{sharedToHRDate}</Content>
					</DataContainer>
                                        <DataContainer>
						<Title>JD Attactment</Title>
						<Content><a href={JDAttachmentLink} target='_blank'>Link</a></Content>
					</DataContainer>
				</CategoryGrid>
                </Card>
        )
}

export default NewJobInfo;