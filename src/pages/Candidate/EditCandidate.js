import React from 'react'
import CandidateInput from './components/CandidateInput'

function EditCandidate(props) {
	return (
		<>
			<CandidateInput edit {...props} />
		</>
	)
}

export default EditCandidate
