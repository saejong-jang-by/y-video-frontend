import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { ItemContainer, Thumbnail } from './styles.js'

class BlockItem extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// img: props.data.thumbnail,
			loaded: false
		}
	}

	componentDidMount = () => {
		const temp = new Image()
		temp.src = this.state.img
		temp.onload = () => {
			this.setState({ loaded: true })
		}
	}

	render() {

		const { name, id } = this.props.data
		const { loaded } = this.state

		return (
			<Link to={`/player/${id}`}>
				<ItemContainer>
					<Thumbnail src={name} loaded={loaded} />
					<h4>{name}</h4>
				</ItemContainer>
			</Link>
		)
	}
}

export default BlockItem
