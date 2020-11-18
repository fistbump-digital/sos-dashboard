const STAGE = process.env.NODE_ENV === 'production' ? true : false

export const API_URI = STAGE
	? 'https://sos-node.herokuapp.com/'
	: 'http://localhost:4000'

export const createJob = `${API_URI}/job`
export const getJobs = `${API_URI}/jobs`

export const getJob = `${API_URI}/job`
export const deleteJob = `${API_URI}/job`
export const deleteJobs = `${API_URI}/jobs`

export const createCandidate = `${API_URI}/candidate`
export const getCandidates = `${API_URI}/candidates`

export const applyJob = `${API_URI}/apply`

export const jobEndpoint = `${API_URI}/job`
export const jobsEndpoint = `${API_URI}/jobs`

export const candidateEndpoint = `${API_URI}/candidate`
export const candidatesEndpoint = `${API_URI}/candidates`

export const companyEndpoint = `${API_URI}/company`
export const companiesEndpoint = `${API_URI}/companies`

export const roleEndpoint = `${API_URI}/role`
export const rolesEndpoint = `${API_URI}/roles`

export const userEndpoint = `${API_URI}/user`
export const usersEndpoint = `${API_URI}/users`

export const loginEndpoint = `${API_URI}/login`
export const logoutEndpoint = `${API_URI}/logout`
export const verifyEndpoint = `${API_URI}/verify`

export const statusEndpoint = `${API_URI}/status`

export const statsEndpoint = `${API_URI}/stats`

// export const getPublicJobs = `${API_URI}/public-jobs`
