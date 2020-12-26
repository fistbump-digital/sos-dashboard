import { IconButton, InputLabel, MenuItem } from '@material-ui/core'
import { AddCircle } from '@material-ui/icons'
import axios from 'axios'
import 'date-fns'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { companiesEndpoint, jobEndpoint } from '../../../api'
import Controls from '../../../components/Controls'
import { companyAtom, currentUserAtom, jobAtom } from '../../../recoil/atoms'
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
} from '../../../styles/StyledMaterialUI'
import {
	addValToArr,
	codeGenerator,
	pickerDateFormat,
	renderArr,
} from '../../../utils/helperFunctions'
import { toast } from '../../../components/Toast'

import {states} from '../../../statesList'

function JobInput({ edit, match }) {
	const history = useHistory()

	const jobId = get(match, 'params.id', '')

	const [companies, setCompanies] = useRecoilState(companyAtom)

	const jobs = useRecoilValue(jobAtom)
	const currentUser = useRecoilValue(currentUserAtom)
	const [job, setJob] = useState(
		jobs && jobs.find((job) => job.jobDetails.jobCode === jobId)
	)

	useEffect(() => {
		if (!job) {
			axios
				.get(`${jobEndpoint}/${jobId}`)
				.then(({ data }) => setJob(data))
				.catch((e) => console.log(e))
		}
	}, [])

	const [jobTitle, setJobTitle] = useState(
		get(job, 'jobOpeningInfo.jobTitle', '')
	)
	const [jobType, setJobType] = useState(get(job, 'jobOpeningInfo.jobType', ''))
	const [industry, setIndustry] = useState(
		get(job, 'jobOpeningInfo.industry', '')
	)
	const [noOfOpening, setNoOfOpening] = useState(
		get(job, 'jobOpeningInfo.noOfOpenings')
	)

	const [salaryFrom, setSalaryFrom] = useState(
		get(job, 'jobOpeningInfo.salary.from')
	)

	const [salaryTo, setSalaryTo] = useState(
		get(job, 'jobOpeningInfo.salary.to')
	)

	//companydetails
	const [companyId, setCompanyId] = useState(
		get(job, 'companyDetails.companyId._id', '')
	)

	const [companyName, setCompanyName] = useState(
		get(job, 'companyDetails.companyName', '')
	)

	const [isCompanyDetailsVisible, setIsCompanyDetailsVisible] = useState(
		get(job, 'companyDetails.isCompanyDetailsVisible', true)
	)
	//jobaddress
	const [jobLocation, setJobLocation] = useState(
		get(job, 'jobAddress.jobLocation')
	)
	const [city, setCity] = useState(get(job, 'jobAddress.city', ''))
	const [zone, setZone] = useState(get(job, 'jobAddress.zone'))
	const [state, setState] = useState(get(job, 'jobAddress.state', ''))
	const [pincode, setPincode] = useState(get(job, 'jobAddress.pincode'))
	const [country, setCountry] = useState(get(job, 'jobAddress.country', ''))

	//jobdetails
	const [jobDescription, setJobDescription] = useState(
		get(job, 'jobDetails.jobDescription', '')
	)

	const [eligibility, setEligibility] = useState(
		get(job, 'jobDetails.eligibility', [])
	)
	const [eligibilityVal, setEligibilityVal] = useState()

	const [responsibilities, setResponsibilities] = useState(
		get(job, 'jobDetails.responsibilities', [])
	)
	const [responsibilitiesVal, setResponsibilitiesVal] = useState()

	const [benefits, setBenefits] = useState(get(job, 'jobDetails.benefits', []))
	const [benefitsVal, setBenefitsVal] = useState()

	const [additionalInformation, setAdditionalInformation] = useState(
		get(job, 'jobDetails.additionalInformation', '')
	)
	const [targetDate, setTargetDate] = useState(
		pickerDateFormat(get(job, 'jobDetails.targetDate'))
	)

	useEffect(() => {
		axios
			.get(companiesEndpoint, { withCredentials: true })
			.then(({ data }) => setCompanies(data))
			.catch((e) => console.log(e))
	}, [])

	//functions

	//handlers
	const saveHandler = async (isEdit) => {
		const newJobData = {
			jobOpeningInfo: {
				jobTitle,
				jobType,
				industry,
				salary: {
					from: salaryFrom,
					to: salaryTo
				},
				assignedOn: new Date(),
				noOfOpenings: Number(noOfOpening),
			},
			companyDetails: {
				companyId,
				companyName,
				isCompanyDetailsVisible,
			},
			jobAddress: {
				jobLocation,
				city,
				zone,
				state,
				pincode,
				country,
			},
			jobDetails: {
				jobCode: codeGenerator(jobTitle, industry, companyId),
				jobDescription,
				additionalInformation,
				targetDate,
				eligibility,
				responsibilities,
				benefits,
			},
			source: currentUser._id,
		}
		try {
			if (isEdit) {
				await axios.patch(`${jobEndpoint}/${jobId}`, newJobData, {
					withCredentials: true,
				})

				toast.success('Job Edited')
				history.goBack()
			} else {
				await axios.post(jobEndpoint, newJobData, { withCredentials: true })
				toast.success('New Job Added')
				history.goBack()
			}
		} catch (err) {
			toast.error('Something went wrong')
		}
	}

	const renderCompaniesOption =
		companies &&
		companies.map(({ _id, companyName }) => {
			return (
				<MenuItem key={_id} value={_id}>
					{companyName}
				</MenuItem>
			)
		})

	const addCompanyHandler = () => {
		history.push('/company/add')
	}

	return (
		<JobInputContainer>
			{/* Control */}
			<Controls title='Job Control'>
				<ControlButton color='secondary'>Reset</ControlButton>
				{(get(currentUser, 'roleId.permissions.job.create') ||
					get(currentUser, 'roleId.permissions.job.update')) && (
					<ControlButton
						variant='contained'
						color='primary'
						onClick={() => saveHandler(edit)}>
						Save
					</ControlButton>
				)}
			</Controls>
			<ContentContainer>
				<Card>
					<CardTitle>Job Opening Info</CardTitle>
					<SMUITextField
						variant='outlined'
						value={jobTitle}
						onChange={(e) => setJobTitle(e.target.value)}
						label='Job Title'
					/>

					<SMUIFormControl variant='outlined'>
						<InputLabel id='industry'>Industry</InputLabel>
						<SMUISelect
							value={industry}
							label='Industry'
							onChange={(e) => setIndustry(e.target.value)}>
							{/* {
								industries.map((data, i) => (
									<MenuItem key={i} value={data.name}>{data.name}</MenuItem>
								))
							} */}
						</SMUISelect>
					</SMUIFormControl>
					
					<SMUITextField
						variant='outlined'
						value={noOfOpening}
						onChange={(e) => setNoOfOpening(e.target.value)}
						type='number'
						label='No. of Opening'
					/>
					<SMUIFormControl variant='outlined'>
						<InputLabel id='jobtype'>Job type</InputLabel>
						<SMUISelect
							value={jobType}
							label='Job type'
							onChange={(e) => setJobType(e.target.value)}>
							<MenuItem value='Full-time'>Full-Time</MenuItem>
							<MenuItem value='Part-time'>Part-time</MenuItem>
							<MenuItem value='Freelancing'>Freelancing</MenuItem>
						</SMUISelect>
					</SMUIFormControl>

					<SMUITextField
						variant='outlined'
						value={salaryFrom}
						onChange={(e) => setSalaryFrom(e.target.value)}
						type='number'
						label='Salary from'
					/>

					<SMUITextField
						variant='outlined'
						value={salaryTo}
						onChange={(e) => setSalaryTo(e.target.value)}
						type='number'
						label='Salary To'
					/>

					<SMUIFormControl variant='outlined'>
						<InputLabel id='company'>Company</InputLabel>
						<SMUISelect
							labelId='company'
							value={companyId}
							label='Company'
							onChange={(e) => setCompanyId(e.target.value)}>
							{renderCompaniesOption}

							<MenuItem value='add New' onClick={addCompanyHandler}>
								+ Add New Company
							</MenuItem>
						</SMUISelect>
					</SMUIFormControl>

					<CheckBoxContainer>
						<StyledCheckbox
							checked={isCompanyDetailsVisible}
							onChange={(e) => setIsCompanyDetailsVisible(e.target.checked)}
							type='checkbox'
						/>
						<CheckBoxLabel>Company Details Visible</CheckBoxLabel>
					</CheckBoxContainer>
				</Card>

				<Card>
					<CardTitle>Job Address</CardTitle>

					<SMUITextField
						variant='outlined'
						value={city}
						onChange={(e) => setCity(e.target.value)}
						label='City'
					/>

					<SMUIFormControl variant='outlined'>
						<InputLabel id='state'>State</InputLabel>
						<SMUISelect
							value={state}
							label='State'
							onChange={(e) => setState(e.target.value)}>
							{
								states.map(data => (
									<MenuItem key={data.key} value={data.name}>{data.name}</MenuItem>
								))
							}
						</SMUISelect>
					</SMUIFormControl>
					<SMUITextField
						variant='outlined'
						value={pincode}
						onChange={(e) => setPincode(e.target.value)}
						label='Pincode'
						type='number'
					/>
					<SMUITextField
						variant='outlined'
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						label='Country'
					/>
					<SMUIFormControl variant='outlined'>
						<InputLabel id='jobLocation'>Job Location</InputLabel>
						<SMUISelect
							value={jobLocation}
							onChange={(e) => setJobLocation(e.target.value)}
							label='Job Location'>
							<MenuItem value='On Location'>On Location</MenuItem>
							<MenuItem value='Remote'>Remote</MenuItem>
						</SMUISelect>
					</SMUIFormControl>

					<SMUIFormControl variant='outlined'>
						<InputLabel id='zone'>Zone</InputLabel>

						<SMUISelect
							value={zone}
							onChange={(e) => setZone(e.target.value)}
							label='Zone'>
							<MenuItem value='North'>North</MenuItem>
							<MenuItem value='East'>East</MenuItem>
							<MenuItem value='West'>West</MenuItem>
							<MenuItem value='South'>South</MenuItem>
							<MenuItem value='North-East'>North-East</MenuItem>
							<MenuItem value='North-West'>North-West</MenuItem>
							<MenuItem value='South-East'>South-East</MenuItem>
							<MenuItem value='South-West'>South-West</MenuItem>
						</SMUISelect>
					</SMUIFormControl>
				</Card>
				<Card>
					<CardTitle>Job Details</CardTitle>

					{eligibility.length > 0 && (
						<ItemListContainer>
							{renderArr(eligibility, setEligibility)}
						</ItemListContainer>
					)}

					<MultipleItemInputContainer
						onSubmit={(e) =>
							addValToArr(e, eligibilityVal, eligibility, setEligibility)
						}>
						<SMUITextField
							variant='outlined'
							value={eligibilityVal}
							onChange={(e) => setEligibilityVal(e.target.value)}
							label='Eligibility'
						/>
						<IconButton type='submit' variant='contained' color='primary'>
							<AddCircle />
						</IconButton>
					</MultipleItemInputContainer>

					{responsibilities.length > 0 && (
						<ItemListContainer>
							{renderArr(responsibilities, setResponsibilities)}
						</ItemListContainer>
					)}
					<MultipleItemInputContainer
						onSubmit={(e) =>
							addValToArr(
								e,
								responsibilitiesVal,
								responsibilities,
								setResponsibilities
							)
						}>
						<SMUITextField
							variant='outlined'
							label='Responsibilities'
							value={responsibilitiesVal}
							onChange={(e) => setResponsibilitiesVal(e.target.value)}
						/>
						<IconButton type='submit' variant='contained' color='primary'>
							<AddCircle />
						</IconButton>
					</MultipleItemInputContainer>

					{benefits.length > 0 && (
						<ItemListContainer>
							{renderArr(benefits, setBenefits)}
						</ItemListContainer>
					)}
					<MultipleItemInputContainer
						onSubmit={(e) =>
							addValToArr(e, benefitsVal, benefits, setBenefits)
						}>
						
						<SMUITextField
							variant='outlined'
							label='Benefits'
							value={benefitsVal}
							onChange={(e) => setBenefitsVal(e.target.value)}
						/>

						<IconButton type='submit' variant='contained' color='primary'>
							<AddCircle />
						</IconButton>

					</MultipleItemInputContainer>

					<SMUITextField
						variant='outlined'
						multiline
						rows={4}
						rowsMax={4}
						value={jobDescription}
						onChange={(e) => setJobDescription(e.target.value)}
						label='Job Description'
					/>

					<SMUITextField
						variant='outlined'
						multiline
						rows={4}
						rowsMax={4}
						value={additionalInformation}
						onChange={(e) => setAdditionalInformation(e.target.value)}
						label='Additional Information'
					/>

					<SMUIFormControl variant='outlined'>
						<SMUITextField
							variant='outlined'
							defaultValue={targetDate}
							label='Target Date'
							onChange={(e) => setTargetDate(e.target.value)}
							type='date'
							placeholder='Target Date'
						/>
					</SMUIFormControl>
				</Card>
			</ContentContainer>

			{/* inputs */}
			{toast}
			{/* {isSaved && <Redirect to='/job' />} */}
		</JobInputContainer>
	)
}

export default JobInput

const JobInputContainer = styled.div``

const CheckBoxContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
`
const CheckBoxLabel = styled.p`
	${RemoveSpaces}
	padding-left: 5px;
	font-size: 0.8em;
	font-weight: 400;
`
