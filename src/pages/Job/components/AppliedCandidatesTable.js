import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { candidateEndpoint, jobEndpoint, statusEndpoint } from '../../../api'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'
import {formatDate, renderWithLoader, titleGenerator} from '../../../utils/helperFunctions'
import { toast } from '../../../components/Toast'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import LoopIcon from '@material-ui/icons/Loop'
import TableSkeletonLoader from '../../../components/TableSkeletonLoader'

function AppliedCandidatesTable({match}) {
        const id = match.params.id
        console.log(id)
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
                axios.patch(`${statusEndpoint}/jobcandidate/${id}`, {newCandidateStatusValue, row, data}, { withCredentials: true })
                .then(data => {
                        toast.success(data.data)
                        setIsEdit(false)
                        axios.get(`${jobEndpoint}/${id}`, {withCredentials: true})
                        .then(data => {
                                setData(data.data)
                                console.log(data)
                                })
                        .catch(err => {console.log(err)})
                })
                .catch(err => {
                        toast.error(`Error: ${err.message}`)
                })

        }

        useEffect(() => {
                axios.get(`${jobEndpoint}/${id}`, {withCredentials: true})
                .then((data) => {
                        setData(data.data)
                        console.log(data)
                })
                .catch(err => console.log(err))
        }, [])

        const shortlistedCandidates = data ? data.candidates.shortlisted : {}
        const assessmentCandidates = data ? data.candidates.assessment : {}
        const hiringManagerReviewCandidates = data ? data.candidates.hiringManagerReview : {}
        const interviewCandidates = data ? data.candidates.interview : {}
        const salaryFitmentCandidates = data ? data.candidates.salaryFitment : {}
        const offerCandidates = data ? data.candidates.offer : {}
        const documentationCandidates = data ? data.candidates.documentation : {}
        const joiningCandidates = data ? data.candidates.joining : {}
        const candidates = data ? shortlistedCandidates.concat(assessmentCandidates, hiringManagerReviewCandidates, interviewCandidates, salaryFitmentCandidates, offerCandidates, documentationCandidates, joiningCandidates) : null

        const jobId = data ? data._id : ''
        const applicants = data ? candidates.length : null
        var candidateStatus = ''

        const rows = []
        const heads = ['Candidate Name', 'Status',  'Contact Number', 'Email', 'CTC', 'Location', 'Current Company', 'Edit Status']

        const createData = (id, name, candidateStatus, contactNo, email, ctc, location, currentCompany) => {
                return {id, name, candidateStatus, contactNo, email, ctc, location, currentCompany}
        }

        const cStatus = (candidate) => {

                candidateStatus = candidate.jobs.shortlisted.includes(jobId) ? "Shortlisted" :
                                candidate.jobs.assessment.includes(jobId) ? "Assessment" :
                                candidate.jobs.hiringManagerReview.includes(jobId) ? "Hiring Manager Review" :
                                candidate.jobs.interview.includes(jobId) ? "Interview" :
                                candidate.jobs.salaryFitment.includes(jobId) ? "Salary Fitment" :
                                candidate.jobs.offer.includes(jobId) ? "Offer" :
                                candidate.jobs.documentation.includes(jobId) ? "Documentation" :
                                candidate.jobs.joining.includes(jobId) ? "Joining" : "Not Assigned"

                return candidateStatus
        }

        if(data) {
                candidates.map((candidate, i) => {
                        const {_id, candidateName, contactNo, email, annualSalary, currentLocation, currentEmployer} = candidate
                        cStatus(candidate)
                        console.log(candidateStatus)
                        rows.push(
                                createData(_id, candidateName, candidateStatus, contactNo, email, annualSalary, currentLocation, currentEmployer)
                        )
                })
        }

        return (
                <>
                {
                        data ? 
                        <TableContainer component={Paper} elevation={1} square>
                                <h4>Total Applicants: {applicants}</h4>
                                <Table aria-label="Applied Candidates Table">
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
                                                                const {id, name, candidateStatus, contactNo, email, ctc, location, currentCompany} = row
                                                                return (
                                                                        <TableRow key={i}>
                                                                                <TableCell component="th" scope="row" style={{minWidth: 130}}>
                                                                                        <Link to={`/candidate/${id}`}>
                                                                                                {name}
                                                                                        </Link>
                                                                                </TableCell>
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
                                                                                <TableCell style={{minWidth: 150}}>
                                                                                        <a href={`tel:${contactNo}`}>{contactNo}</a>
                                                                                </TableCell>
                                                                                <TableCell style={{minWidth: 150}}>
                                                                                        <a href={`mailto:${email}`} target="_blank">{email}</a>
                                                                                </TableCell>
                                                                                <TableCell style={{minWidth: 70}}>{ctc}</TableCell>
                                                                                <TableCell style={{minWidth: 70}}>{location}</TableCell>
                                                                                <TableCell style={{minWidth: 120}}>{currentCompany}</TableCell>
                                                                                {
                                                                                        isEdit.status && isEdit.rowKey === i && isEdit.loading ?
                                                                                        <TableCell align='center' style={{minWidth: 100}}>
                                                                                                <IconButton>
                                                                                                        <LoopIcon />
                                                                                                </IconButton>
                                                                                        </TableCell> :
                                                                                        isEdit.status && isEdit.rowKey === i ? 
                                                                                        <TableCell style={{minWidth: 100}}>
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
                                                                                        <TableCell align='center' style={{minWidth: 100}}>
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

export default AppliedCandidatesTable

const tableHeadStyle = {
        textTransform: 'uppercase',
        fontWeight: 'bold',
}