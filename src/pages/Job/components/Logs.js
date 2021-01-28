import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Card} from '../../../styles'
import {logsApi} from '../../../api'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'
import {formatDate, renderWithLoader, titleGenerator} from '../../../utils/helperFunctions'
import TableSkeletonLoader from '../../../components/TableSkeletonLoader'


const Logs = ({match, data}) => {
        const [logs, setLogs] = useState()
        const jobId = data._id

        useEffect(() => {
                axios.get(logsApi, {withCredentials: true})
                .then(response => {
                        setLogs(response.data)
                })
        }, [])

        const rows = []
        const heads = ['Candidate Name', 'Status', 'Date', 'Changed By']

        const createData = (jobName, jobStatus, date, changedBy) => {
                return {jobName, jobStatus, date, changedBy}
        }

        if(logs) {
                logs.map((log, i) => {
                        if(jobId === log.job._id) {
                                const changesByFullname = `${log.changesBy.firstName} ${log.changesBy.lastName}`
                                rows.push(
                                        createData(log.candidate.candidateName, log.status, log.createdAt, changesByFullname)
                                )
                        }
                })
        }

        return (
                <>
                        {
                                logs ?
                                <TableContainer component={Paper} elevation={1} square>
                                        <Table aria-label="Candidate Logs table">
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
                                                                        const {jobName, jobStatus, date, changedBy} = row
                                                                        return (
                                                                                <TableRow key={i}>
                                                                                        <TableCell>{jobName}</TableCell>
                                                                                        <TableCell>{jobStatus}</TableCell>
                                                                                        <TableCell>{formatDate(date)}</TableCell>
                                                                                        <TableCell>{changedBy}</TableCell>
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

export default Logs

const tableHeadStyle = {
        textTransform: 'uppercase',
        fontWeight: 'bold',
}