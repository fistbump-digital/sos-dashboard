import { selector } from 'recoil'
import { trueKeysToArr } from '../utils/helperFunctions'
import {
	candidateCheckedAtom,
	companyCheckedAtom,
	jobCheckedAtom,
	roleCheckedAtom,
	userCheckedAtom,
} from './atoms'

export const filterTrueJobChecked = selector({
	key: 'filterTrueJobChecked',
	get: ({ get }) => {
		const checkedJob = get(jobCheckedAtom)
		return trueKeysToArr(checkedJob)
	},
})

export const filterTrueCandidateChecked = selector({
	key: 'filterTrueCandidateChecked',
	get: ({ get }) => {
		const checkedCandidate = get(candidateCheckedAtom)
		return trueKeysToArr(checkedCandidate)
	},
})

export const selectedCompanies = selector({
	key: 'filterTrueCompanyChecked',
	get: ({ get }) => {
		const companyChecked = get(companyCheckedAtom)
		return trueKeysToArr(companyChecked)
	},
})

export const selectedRoles = selector({
	key: 'filterTrueRoleChecked',
	get: ({ get }) => {
		const roleChecked = get(roleCheckedAtom)
		return trueKeysToArr(roleChecked)
	},
})

export const selectedUsers = selector({
	key: 'filterTrueUsersChecked',
	get: ({ get }) => {
		const userChecked = get(userCheckedAtom)
		return trueKeysToArr(userChecked)
	},
})
