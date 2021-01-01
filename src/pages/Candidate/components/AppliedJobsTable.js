import React from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'
import {formatDate, renderWithLoader, titleGenerator} from '../../../utils/helperFunctions'

const AppliedJobsTable = ({data}) => {
        const jobs = data.jobs || {}
        const rows = []
        const heads = ['Job Code', 'Job Title', 'State', 'District', 'Zone', 'Status', 'No. of Openings', 'Start Date', 'Close Date', 'Industry', 'Company', 'Vertical', 'Division', 'CTC Min', 'CTC Max', 'No. od CVs Shared', 'Shared with HR Date', 'JD Attachment']

        const createData = (code, title, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink) => {
                return { code, title, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink };
        }

        jobs.map((job, i) => {
                const {jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink} = job
                rows.push(
                        createData(jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink)
                );
        })

        console.log(rows)

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
                                                        const {code, title, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink} = row
                                                        return (
                                                                <TableRow key={i}>
                                                                        <TableCell component="th" scope="row">{code}</TableCell>
                                                                        <TableCell>{title}</TableCell>
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