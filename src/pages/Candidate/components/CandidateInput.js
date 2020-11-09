import {
	Button,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
} from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { candidateEndpoint, createCandidate } from '../../../api'
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
	addValToArr,
	codeGenerator,
	pickerDateFormat,
	renderArr,
} from '../../../utils/helperFunctions'

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

function CandidateInput({ edit, match }) {
	const history = useHistory()

	const currentUser = useRecoilValue(currentUserAtom)
	const candidateCode = get(match, 'params.id', '')
	const candidates = useRecoilValue(candidateAtom)
	const [candidate, setCandidate] = useState(
		candidates &&
			candidates.find((candidate) => candidate.candidateCode === candidateCode)
	)

	const { basic, address, professional } = candidate || {}

	const {
		fullName: _fullName,
		primaryEmail: _primaryEmail,
		secondaryEmail: _secondaryEmail,
		mobile: _mobile,
		pan: _pan,
		dateOfBirth: _dateOfBirth,
	} = basic || {}

	const {
		country: _country,
		pincode: _pincode,
		state: _state,
		streetName: _streetName,
	} = address || {}

	const {
		currentSalary: _currentSalary,
		education: _education,
		expected: _expected,
		experience: _experience,
		functionalArea: _functionalArea,
		industry: _industry,
		skillSet: _skillSet,
	} = professional || {}

	// Basic
	const [fullName, setFullName] = useState(_fullName)

	const [primaryEmail, setPrimaryEmail] = useState(_primaryEmail)
	const [secondaryEmail, setSecondaryEmail] = useState(_secondaryEmail)
	const [mobile, setMobile] = useState(_mobile)
	const [pan, setPan] = useState(_pan)
	const [dateOfBirth, setDateOfBirth] = useState(pickerDateFormat(_dateOfBirth))

	// Address
	const [streetName, setStreetName] = useState(_streetName)
	const [state, setState] = useState(_state)
	const [country, setCountry] = useState(_country)
	const [pincode, setPincode] = useState(_pincode)

	// Professional
	const [experience, setExperience] = useState(_experience || [])
	const [education, setEducation] = useState(_education || [])
	const [skillSet, setSkillSet] = useState(_skillSet || [])
	const [skillSetVal, setSkillSetVal] = useState()

	const [currentSalary, setCurrentSalary] = useState(_currentSalary)
	const [expected, setExpected] = useState(_expected)
	const [industry, setIndustry] = useState(_industry)
	const [functionalArea, setFunctionalArea] = useState(_functionalArea)

	const [jobTitle, setJobTitle] = useState()
	const [company, setCompany] = useState()
	const [summary, setSummary] = useState()
	const [fromDate, setFromDate] = useState(pickerDateFormat())
	const [tillDate, setTillDate] = useState(pickerDateFormat())

	const [qualificationName, setQualificationName] = useState()
	const [instituteName, setInstituteName] = useState()
	const [studiedFromDate, setStudiedFromDate] = useState(pickerDateFormat())
	const [studiedTillDate, setStudiedTillDate] = useState(pickerDateFormat())

	useEffect(() => {
		axios
			.get(`${candidateEndpoint}/${candidateCode}`, { withCredentials: true })
			.then(({ data }) => setCandidate(data))
			.catch((e) => console.log(e))
	}, [])
	
	const addExpHandler = () => {
		const data = {
			jobTitle,
			company,
			summary,
			fromDate,
			tillDate,
		}

		const tempExp = [...experience]
		tempExp.push(data)
		setExperience(tempExp)
	}

	const addEduHandler = () => {
		const data = {
			qualificationName,
			instituteName,
			studiedFromDate,
			studiedTillDate,
		}

		const tempEdu = [...education]
		tempEdu.push(data)
		setEducation(tempEdu)
	}

	const saveHandler = async () => {
		const candidateData = {
			basic: {
				fullName,
				primaryEmail,
				secondaryEmail,
				mobile,
				pan,
				dateOfBirth: new Date(dateOfBirth),
			},

			professional: {
				experience,
				education,
				skillSet,
				currentSalary: Number(currentSalary),
				expected: Number(expected),
				industry,
				functionalArea,
			},
			candidateCode: codeGenerator(fullName, pan, mobile),
			status: 'New',
			stage: 'Not Applied',

			address: {
				streetName,
				state,
				country,
				pincode,
			},
			source: currentUser._id,
		}

		try {
			if (edit) {
				await axios.patch(
					`${candidateEndpoint}/${candidateCode}`,
					candidateData,
					{ withCredentials: true }
				)

				history.goBack()
				toast.success('Candidate Edited')
			} else {
				await axios.post(candidateEndpoint, candidateData, {
					withCredentials: true,
				})
				history.goBack()
				toast.success('New Candidate Added')
			}
		} catch (err) {
			toast.error('Something went wrong')
		}
	}

	return (
		<>
			<Controls title='Candidate Controls'>
				<ControlButton color='secondary'>Reset</ControlButton>
				{(get(currentUser, 'roleId.candidate.job.create') ||
					get(currentUser, 'roleId.permissions.candidate.create')) && (
					<ControlButton
						onClick={saveHandler}
						variant='contained'
						color='primary'>
						Save
					</ControlButton>
				)}
			</Controls>
			<ContentContainer>
				<Card>
					<CardTitle>Personal Information - Basic</CardTitle>
					<SMUITextField
						variant='outlined'
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						label='Full Name'
					/>
					
					<SMUITextField
						variant='outlined'
						type='email'
						value={[primaryEmail]}
						onChange={(e) => setPrimaryEmail(e.target.value)}
						label='Primary Email'
					/>

					<SMUITextField
						variant='outlined'
						type='email'
						value={secondaryEmail}
						onChange={(e) => setSecondaryEmail(e.target.value)}
						label='Secondary Email'
					/>

					<SMUITextField
						variant='outlined'
						value={mobile}
						onChange={(e) => setMobile(e.target.value)}
						label='Mobile No.'
					/> 

					<SMUITextField
						variant='outlined'
						value={pan}
						onChange={(e) => setPan(e.target.value)}
						label='PAN No'
					/>

					<SMUITextField
						variant='outlined'
						type='date'
						label='Date of Birth'
						defaultValue={dateOfBirth}
						onChange={(e) => setDateOfBirth(e.target.value)}
					/>
				</Card>

				<Card>
					<CardTitle>Personal Information - Address</CardTitle>
					<SMUITextField
						variant='outlined'
						value={streetName}
						onChange={(e) => setStreetName(e.target.value)}
						label='Street Name'
					/>

					<SMUITextField
						variant='outlined'
						value={state}
						onChange={(e) => setState(e.target.value)}
						label='State'
					/>

					<SMUITextField
						variant='outlined'
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						label='Country'
					/>

					<SMUITextField
						variant='outlined'
						value={pincode}
						onChange={(e) => setPincode(e.target.value)}
						label='Pincode'
					/>
				</Card>
				<Card>
					<CardTitle>Personal Information - Professional</CardTitle>

					<SMUITextField
						variant='outlined'
						value={currentSalary}
						onChange={(e) => setCurrentSalary(e.target.value)}
						label='Current Salary'
					/>

					<SMUITextField
						variant='outlined'
						value={expected}
						onChange={(e) => setExpected(e.target.value)}
						label='Expected Salary'
					/>
					<SMUIFormControl variant='outlined'>
						<InputLabel id='industry'>Industry</InputLabel>
						<SMUISelect
							value={industry}
							label='Industry'
							onChange={(e) => setIndustry(e.target.value)}>
							<MenuItem value='Finance'>Finance</MenuItem>
							<MenuItem value='Marketing'>Marketing</MenuItem>
						</SMUISelect>
					</SMUIFormControl>
					<SMUIFormControl variant='outlined'>
						<InputLabel id='functionalArea'>Functional Area</InputLabel>
						<SMUISelect
							label='Functional Area'
							value={functionalArea}
							onChange={(e) => setFunctionalArea(e.target.value)}>
							<MenuItem value='Software'>Software</MenuItem>
							<MenuItem value='Accounting'>Accounting</MenuItem>
						</SMUISelect>
					</SMUIFormControl>

					{skillSet.length > 0 && (
						<ItemListContainer>
							{renderArr(skillSet, setSkillSet)}
						</ItemListContainer>
					)}

					<MultipleItemInputContainer
						onSubmit={(e) =>
							addValToArr(e, skillSetVal, skillSet, setSkillSet)
						}>
						<SMUITextField
							variant='outlined'
							value={skillSetVal}
							onChange={(e) => setSkillSetVal(e.target.value)}
							label='Skill Set'
						/>
						<Button type='submit' variant='contained' color='primary'>
							Add
						</Button>
					</MultipleItemInputContainer>
				</Card>

				<Card>
					<CardTitle>Experience</CardTitle>

					{experience.map(
						({ jobTitle, company, summary, fromDate, tillDate }) => {
							return (
								<div key={uuid()}>
									<h1>Job Title</h1>
									<p>{jobTitle}</p>
									<h1>Company</h1>
									<p>{company}</p>
									<h1>Summary</h1>
									<p>{summary}</p>
									<h1>From Date</h1>
									<p>{fromDate}</p>
									<h1>Till Date</h1>
									<p>{tillDate}</p>
								</div>
							)
						}
					)}

					<SMUITextField
						variant='outlined'
						value={jobTitle}
						onChange={(e) => setJobTitle(e.target.value)}
						label='Job Title'
					/>
					<SMUITextField
						variant='outlined'
						value={company}
						onChange={(e) => setCompany(e.target.value)}
						label='Company'
					/>
					<SMUITextField
						variant='outlined'
						value={summary}
						onChange={(e) => setSummary(e.target.value)}
						label='Summary'
					/>
					<SMUITextField
						variant='outlined'
						type='date'
						label='From Date'
						value={fromDate}
						onChange={(e) => setFromDate(e.target.value)}
					/>
					<SMUITextField
						variant='outlined'
						label='Till Date'
						type='date'
						value={tillDate}
						onChange={(e) => setTillDate(e.target.value)}
					/>
					<IconButton
						onClick={addExpHandler}
						variant='contained'
						color='primary'>
						<AddCircleIcon />
					</IconButton>
				</Card>
				<Card>
					<CardTitle>Education</CardTitle>

					{education.map(
						({
							qualificationName,
							instituteName,
							studiedFromDate,
							studiedTillDate,
						}) => {
							return (
								<div key={uuid()}>
									<h1>Qualification</h1>
									<p>{qualificationName}</p>
									<h1>Institute</h1>
									<p>{instituteName}</p>

									<h1>Studied From</h1>
									<p>{studiedFromDate}</p>
									<h1>Studied Till</h1>
									<p>{studiedTillDate}</p>
								</div>
							)
						}
					)}
					<SMUITextField
						variant='outlined'
						value={qualificationName}
						onChange={(e) => setQualificationName(e.target.value)}
						label='Qualification Name'
					/>
					<SMUITextField
						variant='outlined'
						value={instituteName}
						onChange={(e) => setInstituteName(e.target.value)}
						label='Institute Name'
					/>
					<SMUITextField
						variant='outlined'
						type='date'
						label='Studied From Date'
						value={studiedFromDate}
						onChange={(e) => setStudiedFromDate(e.target.value)}
					/>
					<SMUITextField
						variant='outlined'
						label='Studied Till Date'
						type='date'
						value={studiedTillDate}
						onChange={(e) => setStudiedTillDate(e.target.value)}
					/>
					<IconButton
						onClick={addEduHandler}
						variant='contained'
						color='primary'>
						<AddCircleIcon />
					</IconButton>
				</Card>
			</ContentContainer>
		</>
	)
}

export default CandidateInput
