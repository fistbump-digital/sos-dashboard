import React, {useState} from 'react'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { currentUserAtom } from '../../../recoil/atoms'
import {Modal, Button, IconButton, Tooltip, Grid, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core'
import {
	Card,
	CardTitle,
	CategoryTitle,
        Content,
	ContentContainer,
	ControlButton,
	InputContainer,
	ItemListContainer,
	MultipleItemInputContainer,
        StyledTextField,
} from '../../../styles'
import { toast } from '../../../components/Toast'
import CloseIcon from '@material-ui/icons/Close';
import { Close } from '@material-ui/icons'

const BulkUpload = ({setBulkUpload, createBulk, candidate}) => {

        const currentUser = useRecoilValue(currentUserAtom)
        const [selectedFile, setSelectedFile] = useState(null)
        const [source, setSource] = useState('')


        const onFileChange = e => {
                setSelectedFile(e.target.files[0])
        }

        const onFileUpload = () => {
                if(!selectedFile) {
                        toast.error('Please select a file')
                }
                else {
                        const formData = new FormData()
                        formData.append(
                                "myFile",
                                selectedFile,
                                selectedFile.name
                        )

                        console.log(selectedFile)

                        axios({
                                method: 'post',
                                url: candidate ? `${createBulk}/${source}` : `${createBulk}`,
                                data: formData,
                                withCredentials: true,
                                headers: {'Content-Type': 'multipart/form-data'}
                        })
                        .then(() => {
                                toast.success('Data Uploaded Successfully')
                                setSelectedFile(null)
                                setBulkUpload(false)
                        })
                        .catch(err => {
                                toast.error(`Error: ${err.message}`)
                        })
                }
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
                }
                }

        return (
                <ContentContainer>
                <Card style={{position: 'relative', paddingBottom: 40}}>
                        <div style={{position: 'absolute', right: 10}}>
                                <Tooltip title="Close">
                                        <IconButton onClick={() => setBulkUpload(false)}>
                                                <Close />
                                        </IconButton>
                                </Tooltip>
                        </div>
                      <h2>Bulk Upload</h2>
                      <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
                                <input type = 'file' onChange = {onFileChange} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                              </Grid>
                               {
                                       candidate ? (
                                        <Grid item xs={12} md={12}>
                                                <FormControl style={{minWidth: '25%'}} variant="outlined">
                                                        <InputLabel>Select source</InputLabel>
                                                        <Select style={{textAlign: 'left'}}
                                                        value={source}
                                                        onChange={(e) => {setSource(e.target.value)}}
                                                        >
                                                                <MenuItem value=''>None</MenuItem>
                                                                <MenuItem value='naukri'>Naukri</MenuItem>
                                                                <MenuItem value='shine'>Shine</MenuItem>
                                                        </Select>
                                                </FormControl>
                                        </Grid> 
                                       ) : null
                               }
                              <Grid item xs={12} md={12}>
                                <Button onClick={onFileUpload} variant='contained' color='primary'>Upload!</Button>
                              </Grid>
                      </Grid>                     
                      {fileData()}
                </Card>
                </ContentContainer>
        )
}

export default BulkUpload
