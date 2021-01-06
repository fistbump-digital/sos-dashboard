import React, {useEffect} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'
import {formatDate, renderWithLoader, titleGenerator} from '../../../utils/helperFunctions'

const AppliedJobsTable = ({data}) => {

        const shortlistedJobs = data.jobs.shortlisted || {}
        const assessmentJobs = data.jobs.assessment || {}
        const hiringManagerReviewJobs = data.jobs.hiringManagerReview || {}
        const interviewJobs = data.jobs.interview || {}
        const salaryFitmentJobs = data.jobs.salaryFitment || {}
        const offerJobs = data.jobs.offer || {}
        const documentationJobs = data.jobs.documentation || {}
        const joiningJobs = data.jobs.joining || {}
        const jobs = shortlistedJobs.concat(assessmentJobs, hiringManagerReviewJobs, interviewJobs, salaryFitmentJobs, offerJobs, documentationJobs, joiningJobs)


        const candidateId  = data._id
        var candidateStatus = ''
        var applicants = 0

        console.log(data)

        const cStatus = (job) => {

                candidateStatus = job.candidates.shortlisted.includes(candidateId) ? "Shortlisted" :
                                job.candidates.assessment.includes(candidateId) ? "Assessment" :
                                job.candidates.hiringManagerReview.includes(candidateId) ? "Hiring Manager Review" :
                                job.candidates.interview.includes(candidateId) ? "Interview" :
                                job.candidates.salaryFitment.includes(candidateId) ? "Salary Fitment" :
                                job.candidates.offer.includes(candidateId) ? "Offer" :
                                job.candidates.documentation.includes(candidateId) ? "Documentation" :
                                job.candidates.joining.includes(candidateId) ? "Joining" : "Not Assigned"

                return candidateStatus
        }

        const applicantsNumber = (job) => {
                applicants = job.candidates.shortlisted.length + job.candidates.assessment.length +
                                job.candidates.hiringManagerReview.length + job.candidates.interview.length +
                                job.candidates.salaryFitment.length + job.candidates.offer.length + 
                                job.candidates.documentation.length + job.candidates.joining.length

                return applicants
        }

        

        const rows = []
        const heads = ['Job Code', 'Job Title', 'candidate status', 'No. of Applicants', 'State', 'District', 'Zone', 'Status', 'No. of Openings', 'Start Date', 'Close Date', 'Industry', 'Company', 'Vertical', 'Division', 'CTC Min', 'CTC Max', 'No. of CVs Shared', 'Shared with HR', 'JD Attachment']

        const createData = (code, title, candidateStatus, applicants, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink) => {
                return { code, title, candidateStatus, applicants, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink };
        }

        jobs.map((job, i) => {
                const {jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink} = job
                cStatus(job)
                applicantsNumber(job)
                rows.push(
                        createData(jobCode, jobTitle, candidateStatus, applicants, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink)
                );
        })


        return (
                <TableContainer component={Paper} elevation={1} square>
                        <Table aria-label="Applied Jobs Table">
                                <TableHead>
                                        <TableRow>
                                                {
                                                        heads.map((head, i) => (
                                                                <TableCell key={i} style={tableHeadStyle}>{head}</TableCell>
                                                        ))
                                                }
                                        </TableRow>
                                </TableHead>
                                <TableBody>
                                        {
                                                rows.map((row, i) => {
                                                        const {code, title, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink, candidateStatus, applicants} = row
                                                        return (
                                                                <TableRow key={i}>
                                                                        <TableCell component="th" scope="row">{code}</TableCell>
                                                                        <TableCell>{title}</TableCell>
                                                                        <TableCell>{candidateStatus}</TableCell>
                                                                        <TableCell align='center'>{applicants}</TableCell>
                                                                        <TableCell>{state}</TableCell>
                                                                        <TableCell>{district}</TableCell>
                                                                        <TableCell>{zone}</TableCell>
                                                                        <TableCell>{status}</TableCell>
                                                                        <TableCell>{noOfOpening}</TableCell>
                                                                        <TableCell>{formatDate(startDate)}</TableCell>
                                                                        <TableCell>{formatDate(closeDate)}</TableCell>
                                                                        <TableCell>{industry}</TableCell>
                                                                        <TableCell>{company}</TableCell>
                                                                        <TableCell>{vertical}</TableCell>
                                                                        <TableCell>{division}</TableCell>
                                                                        <TableCell>{ctcMin}</TableCell>
                                                                        <TableCell>{ctcMax}</TableCell>
                                                                        <TableCell>{CVShared}</TableCell>
                                                                        <TableCell>{sharedToHRDate}</TableCell>
                                                                        <TableCell align="center"><a href={`${JDAttactmentLink}`}>Link</a></TableCell>
                                                                </TableRow>
                                                        )
                                                })
                                        }
                                </TableBody>
                        </Table>
                </TableContainer>
        )
}

export default AppliedJobsTable

const tableHeadStyle = {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        minWidth: 150
}