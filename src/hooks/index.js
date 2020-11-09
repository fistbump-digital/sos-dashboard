import { useEffect } from 'react'
import axios from 'axios'
import { useRecoilState } from 'recoil'

export const useFetchData = (uri, atom) => {
	const [data, setData] = useRecoilState(atom)
	useEffect(() => {
		axios.get(uri)
			.then(({ data }) => setData(data))
			.catch((e) => console.log(e))
	}, [])
}
