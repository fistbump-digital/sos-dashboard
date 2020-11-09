import React from 'react'
import {
	ModalBody,
	ModalButtonContainer,

	ModalText, ModalTitle,

	ModalWarning
} from '../../styles'
import { SMUIButton, SMUIModal } from '../../styles/StyledMaterialUI'

function DeleteModal({ open, onClose, count, deleteHandler }) {
	return (
		<SMUIModal open={open} onClose={onClose}>
			<ModalBody>
				<ModalTitle>{count} Items Selected</ModalTitle>
				<ModalWarning>Warning: This action cannot be undone</ModalWarning>
				<ModalText>Do you want to delete?</ModalText>
				<ModalButtonContainer>
					<SMUIButton onClick={onClose}>Cancel</SMUIButton>
					<SMUIButton
						onClick={deleteHandler}
						color='secondary'
						variant='contained'>
						Delete
					</SMUIButton>
				</ModalButtonContainer>
			</ModalBody>
		</SMUIModal>
	)
}

export default DeleteModal
