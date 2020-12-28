import { atom, selector } from 'recoil'
import { trueKeysToArr } from '../utils/helperFunctions'

export const jobAtom = atom({
	key: 'jobs',
	default: null,
})

export const singlejobAtom = atom({
	key: 'singleJob',
	default: null
})

export const candidateAtom = atom({
	key: 'candidates',
	default: null,
})

export const companyAtom = atom({
	key: 'companies',
	default: null,
})

export const roleAtom = atom({
	key: 'roles',
	default: null,
})

export const userAtom = atom({
	key: 'users',
	default: null,
})

export const statsAtom = atom({
	key: 'stats',
	default: null
})

//--------------

export const jobCheckedAtom = atom({
	key: 'jobChecked',
	default: {},
})

export const candidateCheckedAtom = atom({
	key: 'candidateChecked',
	default: {},
})

export const companyCheckedAtom = atom({
	key: 'companyChecked',
	default: {},
})

export const roleCheckedAtom = atom({
	key: 'roleChecked',
	default: {},
})

export const userCheckedAtom = atom({
	key: 'userChecked',
	default: {},
})

//------------

export const jobTab = atom({
	key: 'jobTab',
	default: 0,
})

export const candidateTab = atom({
	key: 'candidateTab',
	default: 2,
})

export const appliedCandidateTabAtom = atom({
	key: 'appliedCandidateTabAtom',
	default: 0,
})

// -------------
export const credentialAtom = atom({
	key: 'cred',
	default: { email: '', password: '' },
})

export const isAuthAtom = atom({
	key: 'isAuth',
	default: true,
})

export const currentUserAtom = atom({
	key: 'currentUser',
	default: null,
})

export const statusAtom = atom({
	key: 'status',
	default: null,
})
