import React from 'react'
import JobInput from './components/JobInput'

function EditJob(props) {
	return (
		<>
			<JobInput edit {...props} />
		</>
	)
}

export default EditJob
