import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {logsApi} from '../api'

const Logs = () => {

        const [data, setData] = useState()

        useEffect(() => {

                axios.get(logsApi, {withCredentials: true})
                .then(data => {
                        setData(data.data)
                })
                .catch(err => setData(err))

        }, [])

        console.log(data)

        return (
                <div>
                      logs
                </div>
        )
}

export default Logs
