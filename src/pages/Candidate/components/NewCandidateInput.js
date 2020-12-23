import React,{useEffect, useState} from 'react'
import axios from 'axios'
import * as yup from 'yup'
import {useFormik} from 'formik'
import { candidateEndpoint, createCandidate } from '../../../api'
import {
	addValToArr,
	codeGenerator,
	pickerDateFormat,
	renderArr,
} from '../../../utils/helperFunctions'
import Controls from '../../../components/Controls'
import {
	Card,
	CardTitle,
	CategoryTitle,
	ContentContainer,
	ControlButton,
	InputContainer,
	ItemListContainer,
	MultipleItemInputContainer,
        StyledTextField,
} from '../../../styles'
import {
	Button,
	IconButton,
	InputLabel,
	MenuItem,
        Select,
        Tooltip,
} from '@material-ui/core'
import {
	SMUIFormControl,
	SMUISelect,
	SMUITextField,
} from '../../../styles/StyledMaterialUI'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { useRecoilValue } from 'recoil'
import { candidateAtom, currentUserAtom } from '../../../recoil/atoms'
import { get } from 'lodash'
import { useHistory } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { toast } from '../../../components/Toast'
import PublishIcon from '@material-ui/icons/Publish';
import BulkUpload from './BulkUpload'

const NewCandidateInput = () => {
        const history = useHistory()
        const currentUser = useRecoilValue(currentUserAtom)
        const [loading, setLoading] = useState(false)
        const [bulkUpload, setBulkUpload] = useState(false)

        const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

        const formValidation = yup.object({
                candidateName: yup.string('Enter Your full name').required('Full Name required'), 
                contactNo: yup.string().matches(phoneRegExp, 'Contact number is not valid')
                                .max(10, 'Invalid contact number')
                                .min(10, 'Invalid contact number')
                                .required('Contact number required'),
                email: yup.string('Enter your Email').email('Invalid Email').required('Email required'),
                DOB: yup.string('Select DOB'),
                postalAddress: yup.string('Enter your postal address').required('Address required'),
                resumeTitle: yup.string('Enter resume title'),
                resumeId: yup.string('Enter your resume Id'),
                workExp: yup.string('Enter your work experiance'),
                annualSalary: yup.string('Enter your current annual salary'),
                currentLocation: yup.string('Enter your current location'),
                preferredLocation: yup.string('Enter your preferred location'),
                currentEmployer: yup.string(`Enter your current employer's name`),
                designation: yup.string('Enter your current designation'),
                UGCourse: yup.string('Enter your Graduation name'),
                PGCourse: yup.string('Enter your post graduation name'),
                postPGCourse: yup.string('Enter your post p.g course name'),
                lastActive: yup.string('Select your last active date'),
                commentOne: yup.string(),
                commentTwo: yup.string(),
                commentThree: yup.string(),
                commentFour: yup.string(),
                commentFive: yup.string()
        })

        const formik = useFormik({
                initialValues: {
                        candidateName: '',
                        contactNo: '',
                        email: '',
                        DOB: '',
                        postalAddress: '',
                        resumeTitle: '',
                        resumeId: '',
                        workExp: '',
                        annualSalary: '',
                        currentLocation: '',
                        preferredLocation: '',
                        currentEmployer: '',
                        designation: '',
                        UGCourse: '',
                        PGCourse: '',
                        postPGCourse: '',
                        lastActive: '',
                        commentOne: '',
                        commentTwo: '',
                        commentThree: '',
                        commentFour: '',
                        commentFive: ''
                },
                validationSchema: formValidation,
                onSubmit: (values, {resetForm}) => {
                        // const candidateCode = codeGenerator(values.candidateName, values.currentLocation, values.contactNo);
                        // values.candidateCode = candidateCode
                        // console.log(`submit: ${JSON.stringify(values)}`)
                        setLoading(true)
                        axios.post(candidateEndpoint, values, {withCredentials: true})
                        .then(data => {
                                setLoading(false)
                                toast.success('New Candidate Added')
                                resetForm({values: ''})
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
                        bulkUpload ? <BulkUpload setBulkUpload={setBulkUpload} /> : null
                }
                <form onSubmit={formik.handleSubmit}>
                        <Controls title='Add New Candidate'>
                                <Tooltip title="Excel bulk upload">
                                        <IconButton onClick={() => setBulkUpload(true)}><PublishIcon /></IconButton>
                                </Tooltip>
				<ControlButton color='secondary'>Reset</ControlButton>
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
                                        <CardTitle>Personal Information</CardTitle>
                                        <SMUITextField
                                                variant='outlined'
                                                label='Full Name'
                                                name='candidateName'
                                                id='candidateName'
                                                value={formik.values.candidateName}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.candidateName && Boolean(formik.errors.candidateName)}
                                                                helperText={formik.touched.candidateName && formik.errors.candidateName}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Contact No.'
                                                name='contactNo'
                                                id='contactNo'
                                                value={formik.values.contactNo}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                                                                helperText={formik.touched.contactNo && formik.errors.contactNo}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Email'
                                                type='email'
                                                name='email'
                                                id='email'
                                                value={formik.values.email}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                                helperText={formik.touched.email && formik.errors.email}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Date of Birth'
                                                type='date'
                                                name='DOB'
                                                id='DOB'
                                                value={formik.values.DOB}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.DOB && Boolean(formik.errors.DOB)}
                                                                helperText={formik.touched.DOB && formik.errors.DOB}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Postal Address'
                                                multiline
                                                rows={4}
                                                name='postalAddress'
                                                id='postalAddress'
                                                value={formik.values.postalAddress}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.postalAddress && Boolean(formik.errors.postalAddress)}
                                                                helperText={formik.touched.postalAddress && formik.errors.postalAddress}
                                        />
                                </Card>
                                <Card>
                                        <CardTitle>Professional Information</CardTitle>
                                        <SMUITextField
                                                variant='outlined'
                                                label='Resume Title'
                                                name='resumeTitle'
                                                id='resumeTitle'
                                                value={formik.values.resumeTitle}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.resumeTitle && Boolean(formik.errors.resumeTitle)}
                                                                helperText={formik.touched.resumeTitle && formik.errors.resumeTitle}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Resume Id'
                                                name='resumeId'
                                                id='resumeId'
                                                value={formik.values.resumeId}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.resumeId && Boolean(formik.errors.resumeId)}
                                                                helperText={formik.touched.resumeId && formik.errors.resumeId}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Work Exp'
                                                name='workExp'
                                                id='wordExp'
                                                value={formik.values.workExp}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.workExp && Boolean(formik.errors.workExp)}
                                                                helperText={formik.touched.workExp && formik.errors.workExp}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Annual Salary'
                                                name='annualSalary'
                                                id='annualSalary'
                                                value={formik.values.annualSalary}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.annualSalary && Boolean(formik.errors.annualSalary)}
                                                                helperText={formik.touched.annualSalary && formik.errors.annualSalary}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Current Location'
                                                name='currentLocation'
                                                id='currentLocation'
                                                value={formik.values.currentLocation}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.currentLocation && Boolean(formik.errors.currentLocation)}
                                                                helperText={formik.touched.currentLocation && formik.errors.currentLocation}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Preferred Location'
                                                name='preferredLocation'
                                                id='preferredLocation'
                                                value={formik.values.preferredLocation}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.preferredLocation && Boolean(formik.errors.preferredLocation)}
                                                                helperText={formik.touched.preferredLocation && formik.errors.preferredLocation}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Current Employer'
                                                name='currentExmployer'
                                                id='currentEmployer'
                                                value={formik.values.currentEmployer}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.currentEmployer && Boolean(formik.errors.currentEmployer)}
                                                                helperText={formik.touched.currentEmployer && formik.errors.currentEmployer}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Designation'
                                                name='designation'
                                                id='designation'
                                                value={formik.values.designation}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.designation && Boolean(formik.errors.designation)}
                                                                helperText={formik.touched.designation && formik.errors.designation}
                                        />
                                </Card>
                                <Card>
                                        <CardTitle>Education</CardTitle>
                                        <SMUITextField
                                                variant='outlined'
                                                label='U.G. Course'
                                                name='UGCourse'
                                                id='UGCourse'
                                                value={formik.values.UGCourse}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.UGCourse && Boolean(formik.errors.UGCourse)}
                                                                helperText={formik.touched.UGCourse && formik.errors.UGCourse}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='P.G. Course'
                                                name='PGCourse'
                                                id='PGCourse'
                                                value={formik.values.PGCourse}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.PGCourse && Boolean(formik.errors.PGCourse)}
                                                                helperText={formik.touched.PGCourse && formik.errors.PGCourse}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Post P.G. Course'
                                                name='postPGCourse'
                                                id='postPGCourse'
                                                value={formik.values.postPGCourse}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.postPGCourse && Boolean(formik.errors.postPGCourse)}
                                                                helperText={formik.touched.postPGCourse && formik.errors.postPGCourse}
                                        />
                                </Card>
                                <Card>
                                        <CardTitle>General</CardTitle>
                                        <SMUITextField
                                                variant='outlined'
                                                label='Last Active'
                                                type="date"
                                                name='lastActive'
                                                id='lastActive'
                                                value={formik.values.lastActive}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.lastActive && Boolean(formik.errors.lastActive)}
                                                                helperText={formik.touched.lastActive && formik.errors.lastActive}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Comment 1'
                                                multiline
                                                rows={2}
                                                name='commentOne'
                                                id='commentOne'
                                                value={formik.values.commentOne}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.commentOne && Boolean(formik.errors.commentOne)}
                                                                helperText={formik.touched.commentOne && formik.errors.commentOne}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Comment 2'
                                                multiline
                                                rows={2}
                                                name='commentTwo'
                                                id='commentTwo'
                                                value={formik.values.commentTwo}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.commentTwo && Boolean(formik.errors.commentTwo)}
                                                                helperText={formik.touched.commentTwo && formik.errors.commentTwo}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Comment 3'
                                                multiline
                                                rows={2}
                                                name='commentThree'
                                                id='commentThree'
                                                value={formik.values.commentThree}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.commentThree && Boolean(formik.errors.commentThree)}
                                                                helperText={formik.touched.commentThree && formik.errors.commentThree}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Comment 4'
                                                multiline
                                                rows={2}
                                                name='commentFour'
                                                id='commentFour'
                                                value={formik.values.commentFour}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.commentFour && Boolean(formik.errors.commentFour)}
                                                                helperText={formik.touched.commentFour && formik.errors.commentFour}
                                        />
                                        <SMUITextField
                                                variant='outlined'
                                                label='Comment 5'
                                                multiline
                                                rows={2}
                                                name='commentFive'
                                                id='commentFive'
                                                value={formik.values.commentFive}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.commentFive && Boolean(formik.errors.commentFive)}
                                                                helperText={formik.touched.commentFive && formik.errors.commentFive}
                                        />
                                </Card>
                        </ContentContainer>
                        </form>
                </>
        )
}

export default NewCandidateInput
