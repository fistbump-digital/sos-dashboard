import React, {useState} from 'react'
import axios from 'axios'
import {createBulkCandidate} from '../../../api/index'

const BulkUpload = () => {

        const [selectedFile, setSelectedFile] = useState(null)

        const onFileChange = e => {
                setSelectedFile(e.target.files[0])
        }

        const onFileUpload = () => {
                const formData = new FormData()
                formData.append(
                        "myFile",
                        selectedFile,
                        selectedFile.name
                )

                console.log(selectedFile)

                axios({
                        method: 'post',
                        url: createBulkCandidate,
                        data: formData,
                        withCredentials: true,
                        headers: {'Content-Type': 'multipart/form-data'}
                })
                .then(() => alert('Data Upload Successfully'))
                .catch(err => alert(err))
        }

        const fileData = () => { 
	
                if (selectedFile) { 
                        
                        return ( 
                        <div> 
                                <h2>File Details:</h2> 
                                <p>File Name: {selectedFile.name}</p> 
                                {/* <p>File Type: {selectedFile.type}</p>  */}
                                <p> 
                                Last Modified:{" "} 
                                {selectedFile.lastModifiedDate.toDateString()} 
                                </p> 
                        </div> 
                        )
                } else { 
                        return ( 
                                <div> 
                                        <br /> 
                                        <h4>Choose before Pressing the Upload button</h4> 
                                </div> 
                                )
                        } 
                }

        return (
                <div>
                      <h2>Bulk Upload</h2>
                      <input type = 'file' onChange = {onFileChange} />
                      <button onClick={onFileUpload}>Upload!</button>
                      {fileData()}
                </div>
        )
}

export default BulkUpload
