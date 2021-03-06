import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import { Overlay } from 'components'

import { Wrapper, Comets, Welcome, Logo, Button } from './styles'

class Landing extends PureComponent {
	render() {

		const {
			overlay,
		} = this.props.viewstate

		const {
			toggleOverlay,
			handleLogin,
			handlePublicCollections,
		} = this.props.handlers

		return (
			<Wrapper>
				<Comets className='left' />
				<Comets className='right' />

				<Welcome>
					<div>
						<h1>YVIDEO&nbsp;</h1>
						<Logo />
					</div>

					<div className='button-wrapper'>
						<Button className='primary' onClick={handleLogin}>Sign In</Button>
						<Button className='secondary' onClick={toggleOverlay}>About</Button>
						<Button className='secondary'><Link to={`/search-public-collections`}>Public Videos</Link></Button>
						{/* <Button className='secondary' onClick={toggleOverlay}>Public</Button> */}
					</div>

				</Welcome>

				{ overlay && <Overlay toggleOverlay={toggleOverlay} /> }

			</Wrapper>
		)
	}
}

export default Landing
