import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { candidateEndpoint, statusEndpoint, logsApi } from '../../../api'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'
import {formatDate, renderWithLoader, titleGenerator} from '../../../utils/helperFunctions'
import { toast } from '../../../components/Toast'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import LoopIcon from '@material-ui/icons/Loop'
import TableSkeletonLoader from '../../../components/TableSkeletonLoader'

const AppliedJobsTable = ({match}) => {
        const id = match.params.id
        const [isEdit, setIsEdit] = useState({
                status: false,
                rowKey: null,
                loading: false
        })
        const [newCandidateStatusValue, setNewCandidateStatusValue] = useState()
        const [data, setData] = useState()

        const editHandler = (row, i) => {
                setIsEdit({
                        status: true,
                        rowKey: i,
                        loading: false
                })
        }

        const editChange = (e) => {
                setNewCandidateStatusValue(e.target.value)
        }

        const editSave = (row, i) => {
                setIsEdit({
                        status: true,
                        rowKey: i,
                        loading: true
                })

                const statusRequest = axios.patch(`${statusEndpoint}/${id}`, {newCandidateStatusValue, row, data}, {withCredentials: true})
                const logRequest = axios.post(logsApi, {candidate: data, jobIds: [row.code], status: newCandidateStatusValue}, {withCredentials: true})

                axios.all([statusRequest, logRequest])
                .then(axios.spread((...response) => {
                        toast.success(data.data)
                        setIsEdit(false)
                        axios.get(`${candidateEndpoint}/${id}`, {withCredentials: true})
                        .then(data => {
                                setData(data.data)
                                console.log(data)
                                })
                        .catch(err => {console.log(err)})
                }))
                .catch(err => {
                        toast.error(`Error: ${err.message}`)
                })

        }

        useEffect(() => {
                axios.get(`${candidateEndpoint}/${id}`, {withCredentials: true})
                .then(data => {
                        setData(data.data)
                        console.log(data)
                        })
                .catch(err => console.log(err))
        }, [])

        const shortlistedJobs = data ? data.jobs.shortlisted : {}
        const assessmentJobs = data ? data.jobs.assessment : {}
        const hiringManagerReviewJobs = data ? data.jobs.hiringManagerReview : {}
        const interviewJobs = data ? data.jobs.interview : {}
        const salaryFitmentJobs = data ? data.jobs.salaryFitment : {}
        const offerJobs = data ? data.jobs.offer : {}
        const documentationJobs = data ? data.jobs.documentation : {}
        const joiningJobs = data ? data.jobs.joining : {}
        const jobs = data ? shortlistedJobs.concat(assessmentJobs, hiringManagerReviewJobs, interviewJobs, salaryFitmentJobs, offerJobs, documentationJobs, joiningJobs) : null

        const candidateId  = data ?  data._id : ''
        var candidateStatus = ''
        var applicants = 0

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
        const heads = ['Job Code', 'Job Title', 'candidate status', 'Applicants', 'State', 'Zone', `Edit Status`]

        const createData = (code, title, candidateStatus, applicants, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink) => {
                return { code, title, candidateStatus, applicants, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink };
        }
        if(data) {
                jobs.map( (job, i) => {
                        const {jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink} = job
                        cStatus(job)
                        applicantsNumber(job)
                        rows.push(
                                createData(jobCode, jobTitle, candidateStatus, applicants, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink)
                        );
                })
        }


        return (
                <>
                {
                        data ? 
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
                                                                        <TableCell component="th" scope="row">
                                                                                <Link to={`/job/${code}`}>{code}</Link>
                                                                        </TableCell>
                                                                        <TableCell>{title}</TableCell>
                                                                        {
                                                                                isEdit.status && isEdit.rowKey === i ?
                                                                                <TableCell>
                                                                                        <FormControl variant='outlined' style={{width: '100%'}}>
                                                                                                <InputLabel>Select</InputLabel>
                                                                                                <Select id='candidateStatus' value={newCandidateStatusValue} onChange={(e) => editChange(e)} label="Candidate Status">
                                                                                                        <MenuItem value='shortlisted'>Shortlisted</MenuItem>
                                                                                                        <MenuItem value='assessment'>Assessment</MenuItem>
                                                                                                        <MenuItem value='hiringManagerReview'>Hiring Manager Review</MenuItem>
                                                                                                        <MenuItem value='interview'>Interview</MenuItem>
                                                                                                        <MenuItem value='salaryFitment'>Salary Fitment</MenuItem>
                                                                                                        <MenuItem value='offer'>Offer</MenuItem>
                                                                                                        <MenuItem value='documentation'>Documentation</MenuItem>
                                                                                                        <MenuItem value='joining'>Joining</MenuItem>
                                                                                                </Select>
                                                                                        </FormControl>
                                                                                </TableCell>
                                                                                :
                                                                                <TableCell align='left'>{candidateStatus}</TableCell>
                                                                        }
                                                                        <TableCell align='center'>{applicants}</TableCell>
                                                                        <TableCell>{state}</TableCell>
                                                                        <TableCell>{zone}</TableCell>
                                                                        {
                                                                                isEdit.status && isEdit.rowKey === i && isEdit.loading ?
                                                                                <TableCell align='center'>
                                                                                        <IconButton>
                                                                                                <LoopIcon />
                                                                                        </IconButton>
                                                                                </TableCell> :
                                                                                isEdit.status && isEdit.rowKey === i ? 
                                                                                <TableCell>
                                                                                        <Tooltip title='Close'>
                                                                                                <IconButton onClick={() => setIsEdit(false)}>
                                                                                                        <CloseIcon />
                                                                                                </IconButton>
                                                                                        </Tooltip>
                                                                                        <Tooltip title='Save'>
                                                                                                <IconButton onClick={() => editSave(row, i)}>
                                                                                                        <DoneIcon />
                                                                                                </IconButton>
                                                                                        </Tooltip>
                                                                                </TableCell> :
                                                                                <TableCell align='center'>
                                                                                        <Tooltip title='Edit Candidate Status'>
                                                                                                <IconButton onClick={() => editHandler(row, i)}>
                                                                                                        <EditIcon />
                                                                                                </IconButton>
                                                                                        </Tooltip>
                                                                                        
                                                                                </TableCell>
                                                                        }
                                                                </TableRow>
                                                        )
                                                })
                                        }
                                </TableBody>
                        </Table>
                </TableContainer>
                :
                <TableSkeletonLoader />
                }
                </>
        )
}

export default AppliedJobsTable

const tableHeadStyle = {
        textTransform: 'uppercase',
        fontWeight: 'bold',
}