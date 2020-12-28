import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import {useFormik} from 'formik'
import 'date-fns'
import { get } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import styled from 'styled-components'
import { companiesEndpoint, jobEndpoint, createBulkJob } from '../../../api'
import Controls from '../../../components/Controls'
import { companyAtom, currentUserAtom, jobAtom, singlejobAtom } from '../../../recoil/atoms'
import { IconButton, InputLabel, MenuItem, Tooltip, Grid, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AddCircle } from '@material-ui/icons'
import PublishIcon from '@material-ui/icons/Publish'
import {
	Card,
	CardTitle,
	ContentContainer,
	ControlButton,
	ItemListContainer,
	MultipleItemInputContainer,
	RemoveSpaces,
	StyledCheckbox,
} from '../../../styles'
import {
	SMUIFormControl,
	SMUISelect,
        SMUITextField,
        SMUIAutocomplete
} from '../../../styles/StyledMaterialUI'
import {
	addValToArr,
	codeGenerator,
	pickerDateFormat,
	renderArr,
} from '../../../utils/helperFunctions'
import { toast } from '../../../components/Toast'
import BulkUpload from '../../Candidate/components/BulkUpload'
import {jobStatus, industries, companies, verticals, divisions} from '../../../jobsDataList'
import {states, districts, zones} from '../../../statesList'

function NewJobInput(props) {

        const {edit} = props
        const history = useHistory()
        const currentUser = useRecoilValue(currentUserAtom)
        const [loading, setLoading] = useState(false)
        const [bulkUpload, setBulkUpload] = useState(false)
        const [singleJobData, setSingleJobData] = useRecoilState(singlejobAtom)

        const formValidation = yup.object({
                jobCode: yup.string('Enter job code').required('Job Code required'),
                jobTitle: yup.string('Enter job title / requirement name').required('Job title required'),
                state: yup.string('Select state'),
                district: yup.string('Selete district'),
                zone: yup.string('Select zone'),
                status: yup.string('Enter job status'),
                noOfOpening: yup.string('Enter total number of opening for this job'),
                startDate: yup.string('Select starting date'),
                closeDate: yup.string('Select closing date'),
                industry: yup.string('Select Industry'),
                company: yup.string('Select company'),
                vertical: yup.string('Select vertical'),
                division: yup.string('Select division'),
                ctcMin: yup.string('Enter minimum CTC'),
                ctcMax: yup.string('Enter maximum CTC'),
                CVShared: yup.number('Enter number of CVs shared for this job'),
                sharedToHRDate: yup.string('Enter Date when shared with HR'),
                JDAttachmentLink: yup.string('Enter atachment link')
        })

        const {jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink} = singleJobData || {}

        const formik = useFormik({
                initialValues:
                edit ? 
                        {
                                jobCode,
                                jobTitle,
                                state,
                                district,
                                zone,
                                status,
                                noOfOpening,
                                startDate: pickerDateFormat(startDate),
                                closeDate: pickerDateFormat(closeDate),
                                industry,
                                company,
                                vertical,
                                division,
                                ctcMin,
                                ctcMax,
                                CVShared,
                                sharedToHRDate,
                                JDAttachmentLink
                        } :
                        {
                                jobCode: '',
                                jobTitle: '',
                                state: '',
                                district: '',
                                zone: '',
                                status: '',
                                noOfOpening: '',
                                startDate: '',
                                closeDate: '',
                                industry: '',
                                company: '',
                                vertical: '',
                                division: '',
                                ctcMin: '',
                                ctcMax: '',
                                CVShared: '',
                                sharedToHRDate: '',
                                JDAttachmentLink: ''
                        },
                validationSchema: formValidation,
                onSubmit: (values, {resetForm}) => {
                        // alert(`submit: ${JSON.stringify(values)}`)
                        setLoading(true)
                        !edit ? 
                        axios.post(jobEndpoint, values, {withCredentials: true})
                        .then(data => {
                                setLoading(false)
                                toast.success('New job added')
                                resetForm({values: ''})
                        })
                        .catch(err => {
                                setLoading(false)
                                toast.error(`Error: ${err.message}`)
                        }) : 
                        axios.patch(`${jobEndpoint}/${jobCode}`, values, {withCredentials: true})
                        .then(data => {
                                setLoading(false);
                                toast.success(`job updated`)
                                resetForm({values: ''})
                                setSingleJobData(data.data)
                                setTimeout(() => {history.goBack()}, 1000)
                        })
                        .catch(err => {
                                setLoading(false)
                                toast.error(`Error: ${err.message}`)
                        })
                }
        })

        return (
                <>
                {
                        bulkUpload ? <BulkUpload setBulkUpload={setBulkUpload} createBulk={createBulkJob} /> : null
                }
                        <form onSubmit={formik.handleSubmit}>
                        <Controls title='Add New Job'>
                                {
                                        !edit ? (
                                                <Tooltip title="Excel bulk upload">
                                                        <IconButton ><PublishIcon onClick={() => setBulkUpload(true)} /></IconButton>
                                                </Tooltip>
                                        ) : null
                                }
				<ControlButton color='secondary' onClick={() => formik.resetForm()}>Reset</ControlButton>
				{(get(currentUser, 'roleId.candidate.job.create') ||
					get(currentUser, 'roleId.permissions.candidate.create')) && (
					<ControlButton
                                                type='submit'
						variant='contained'
						color='primary'>
						Save
					</ControlButton>
				)}
			</Controls>
                        <ContentContainer>
                                <Card>
                                        <CardTitle>Job Information</CardTitle>

                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='Job Code'
                                                        name='jobCode'
                                                        id='jobCode'
                                                        value={formik.values.jobCode}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.jobCode && Boolean(formik.errors.jobCode)}
                                                                        helperText={formik.touched.jobCode && formik.errors.jobCode}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='Job Title'
                                                        name='jobTitle'
                                                        id='jobTitle'
                                                        value={formik.values.jobTitle}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                                                                        helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='State'
                                                        name='state'
                                                        id='state'
                                                        value={formik.values.state}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.state && Boolean(formik.errors.state)}
                                                                        helperText={formik.touched.state && formik.errors.state}
                                                />
                                                <SMUITextField
                                                                label="District" 
                                                                variant="outlined"
                                                                name='district'
                                                                id='district'
                                                                value={formik.values.district}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.district && Boolean(formik.errors.district)}
                                                                helperText={formik.touched.district && formik.errors.district}
                                                        />
                                                <SMUITextField 
                                                                label="Zone" 
                                                                variant="outlined"
                                                                name='zone'
                                                                id='zone'
                                                                value={formik.values.zone}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.zone && Boolean(formik.errors.zone)}
                                                                helperText={formik.touched.zone && formik.errors.zone} 
                                                        />
                                                <SMUITextField 
                                                        label="Job status" 
                                                        variant="outlined"
                                                        name='status'
                                                        id='status'
                                                        value={formik.values.status}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.status && Boolean(formik.errors.status)}
                                                        helperText={formik.touched.status && formik.errors.status}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='No. of openings'
                                                        name='noOfOpening'
                                                        id='noOfOpening'
                                                        type="number"
                                                        value={formik.values.noOfOpening}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.noOfOpening && Boolean(formik.errors.noOfOpening)}
                                                                        helperText={formik.touched.noOfOpening && formik.errors.noOfOpening}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='Start date'
                                                        name='startDate'
                                                        id='startDate'
                                                        type="date"
                                                        defaultValue={formik.values.startDate}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                                                        helperText={formik.touched.startDate && formik.errors.startDate}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='Close date'
                                                        name='closeDate'
                                                        id='closeDate'
                                                        type="date"
                                                        defaultValue={formik.values.closeDate}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.closeDate && Boolean(formik.errors.closeDate)}
                                                                        helperText={formik.touched.closeDate && formik.errors.closeDate}
                                                />
                                                <SMUITextField 
                                                                label="Industry" 
                                                                variant="outlined"
                                                                name='industry'
                                                                id='industry'
                                                                value={formik.values.industry}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.industry && Boolean(formik.errors.industry)}
                                                                helperText={formik.touched.industry && formik.errors.industry}
                                                        />
                                                <SMUITextField
                                                                label="Company" 
                                                                variant="outlined"
                                                                name='company'
                                                                id='company'
                                                                value={formik.values.company}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.company && Boolean(formik.errors.company)}
                                                                helperText={formik.touched.company && formik.errors.company}
                                                        />
                                                <SMUITextField
                                                                label="Vertical" 
                                                                variant="outlined"
                                                                name='vertical'
                                                                id='vertical'
                                                                value={formik.values.vertical}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.verticals && Boolean(formik.errors.vertical)}
                                                                helperText={formik.touched.verticals && formik.errors.vertical}
                                                        />
                                                <SMUITextField
                                                        label="Division" 
                                                        variant="outlined"
                                                        name='division'
                                                        id='division'
                                                        value={formik.values.division}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.vertical && Boolean(formik.errors.division)}
                                                        helperText={formik.touched.vertical && formik.errors.division}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='CTC Min'
                                                        name='ctcMin'
                                                        id='ctcMin'
                                                        value={formik.values.ctcMin}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.ctcMin && Boolean(formik.errors.ctcMin)}
                                                                        helperText={formik.touched.ctcMin && formik.errors.ctcMin}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='CTC Max'
                                                        name='ctcMax'
                                                        id='ctcMax'
                                                        value={formik.values.ctcMax}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.ctcMax && Boolean(formik.errors.ctcMax)}
                                                                        helperText={formik.touched.ctcMax && formik.errors.ctcMax}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='No. of CVs shared'
                                                        name='CVShared'
                                                        id='CVShared'
                                                        type='number'
                                                        value={formik.values.CVShared}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.CVShared && Boolean(formik.errors.CVShared)}
                                                                        helperText={formik.touched.CVShared && formik.errors.CVShared}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='Shared with HR'
                                                        name='sharedToHRDate'
                                                        id='sharedToHRDate'
                                                        value={formik.values.sharedToHRDate}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.sharedToHRDate && Boolean(formik.errors.sharedToHRDate)}
                                                                        helperText={formik.touched.sharedToHRDate && formik.errors.sharedToHRDate}
                                                />
                                                <SMUITextField
                                                        style={{width: '100%'}}
                                                        variant='outlined'
                                                        label='JD attactment link'
                                                        name='JDAttachmentLink'
                                                        id='JDAttachmentLink    '
                                                        value={formik.values.JDAttachmentLink}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.JDAttachmentLink && Boolean(formik.errors.JDAttachmentLink)}
                                                                        helperText={formik.touched.JDAttachmentLink && formik.errors.JDAttachmentLink}
                                                />
                                </Card>
                        </ContentContainer>
                        </form>
                </>
        )
}

export default NewJobInput
