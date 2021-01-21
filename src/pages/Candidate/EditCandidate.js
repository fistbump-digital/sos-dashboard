import React from 'react'
// import CandidateInput from './components/CandidateInput'
import NewCandidateInput from './components/NewCandidateInput'

function EditCandidate(props) {
	return (
		<>
			{/* <CandidateInput edit {...props} /> */}
			<NewCandidateInput edit {...props} />
		</>
	)
}

export default EditCandidate
