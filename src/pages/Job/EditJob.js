import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { get } from 'lodash'
import JobInput from './components/JobInput'
import NewJobInput from './components/NewJobInput'

function EditJob(props) {
	return (
		<>
			{/* <JobInput edit {...props} /> */}
			<NewJobInput edit={true} {...props} />
		</>
	)
}

export default EditJob
