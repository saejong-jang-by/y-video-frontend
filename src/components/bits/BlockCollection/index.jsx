import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { BlockItem } from 'components/bits'

import { Container, Header, SlideWrapper, Arrow, BlockEnd } from './styles.js'

export default class BlockCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			left: true,
			hideLeft: true,
		}

		this.wrapper = React.createRef()
	}

	scrollListener = e => {
		if (e.target.scrollLeft === 0) {
			this.setState({
				left: true,
			}, () => {
				setTimeout(() => {
					this.setState({
						hideLeft: true,
					})
				}, 250)
			})
		} else if (e.target.scrollLeft !== 0) {
			this.setState({
				hideLeft: false,
			}, () => {
				this.setState({
					left: false,
				})
			})
		}
	}

	scrollLeft = () => {
		this.wrapper.current.scrollBy({
			left: -179,
		})
	}

	scrollRight = () => {
		this.wrapper.current.scrollBy({
			left: 178,
		})
	}

	render() {

		const { name, content } = this.props.collection
		// contentIds is filtered for published content
		// This way, the number of videos (<p>{content.length} Videos</p>) includes the unpublished ones
		// const contentIds = this.props.contentIds

		const publishContent = content ? content.filter(item => item.published) : []

		if(this.props.collection.published){
			return (
				<Container>
					<Header>
						<Link to={`/`}>{name}</Link>
						{
							publishContent.length === 0 ? (
								<p>This collection is empty</p>
							)
								:
								publishContent.length === 1 ? (
									<p>1 item</p>
								)
									:
									<p>{publishContent.length} items</p>
						}
						{ this.props.collection.id === `public` ? (
							<Link to={`/search-public-collections`}>Search Public Collections</Link>
						) : ``}
					</Header>
					<div>
						<Arrow className='left' left={this.state.left} hideLeft={this.state.hideLeft} onClick={this.scrollLeft}>
							<div />
						</Arrow>
						<SlideWrapper className='slide-wrapper' count={publishContent.length} onScroll={this.scrollListener} ref={this.wrapper} onScrollCapture={this.scrollListener}>
							{
								publishContent.map(item => {
									return <BlockItem key={item.id} data={item}/>
								})
							}
							<BlockEnd />
						</SlideWrapper>
						<Arrow className='right' onClick={this.scrollRight}>
							<div />
						</Arrow>
					</div>
				</Container>
			)
		} else
			return null

	}
}