import React from 'react'
import styled from 'styled-components'
import SigninForm from './components/SigninForm'
import AuthIcon from '../../assets/icons/auth.svg'

function Signin() {
	return (
		<SigninContainer>
			{/* Image */}
			<AuthImage src={AuthIcon} />

			{/* SiginForm */}
			<SigninForm />
		</SigninContainer>
	)
}

export default Signin

const SigninContainer = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-around;
	height: 100%;
`

const AuthImage = styled.img`
	width: 500px;
	flex: 1;
	padding: 70px;
`
