import styled, {css} from 'styled-components'

import carrot from 'assets/carrot.svg'
import trashIcon from 'assets/trash.svg'

const Style = styled.div`

	& > div {
	}
`
export default Style

export const CollectionRow = styled.div`

	& > button {
		margin: 1rem;
		float: right;
	}
`

export const Collection = styled.div`
	display: grid;
	/* grid-template-columns: 8rem 15rem auto 2rem; */
	grid-template-columns: 20rem auto 1.5rem;
	justify-items: start;
	align-items: center;
	background: ${props => props.isOpen ? ` #d7d7d7` : ``};

	padding: 2rem;
	border-top: 1px solid #ccc;

	& > div {
		flex: 1;

		background: url(${carrot}) center no-repeat;
		background-size: contain;
		height: 1.5rem;
		width: 1.5rem;

		transform: ${props => props.isOpen ? `rotate(-180deg)` : `rotate(0deg)`};
		transition: transform .25s ease-in-out;
	}

	& > h3 {
		flex: 2;
		padding-right:1rem;
		font-weight: 400;
	}

	& > p {
		flex: 2;
		color: #a4a4a4;
	}

	:hover {
		cursor: pointer;
		text-decoration: underline;
		background: #bfbfbf;
	}
`

export const Body = styled.div`
	height: ${props => props.isOpen ? `${(parseInt(props.count) * 7 + 6).toString()}rem` : `0`};
	transition: height .25s ease-in-out;
	overflow: hidden;
	background: #efefef;

`

export const PublicButton = styled.button`
  color: white;
	& > h3{
		font-weight: lighter;
	}
	font-size: 1rem;
  background-color: ${props => props.isPublic === 0 && props.isPublic === 1 ? `#FFBF00` : `#0582CA`};

  letter-spacing: 0.05rem;

  padding: 0.8rem 1.5rem;
  /* margin-right: 3rem; */

	margin: 1rem;

  border: none;
  border-radius: 0.3rem;

  cursor: pointer;
  outline: none;
`

export const MoreButton = styled.button`
  color: white;
  font-weight: bold;
  background-color: ${props => props.isPublic === 0 && props.isPublic === 1 ? `#FFBF00` : `#0582CA`};

  letter-spacing: 0.05rem;

  padding: 0.8rem 1.5rem;
  /* margin-right: 3rem; */

	margin: 1rem;

  border: none;
  border-radius: 0.3rem;

  cursor: pointer;
  outline: none;
`

export const PublicCollectionButton = styled.div`
	display: flex;
	justify-content: flex-end;

	& > h3{
		width: 100%;
		text-align: end !important;
		margin-top: 1rem;
		margin-right: 1rem;
		font-weight: lighter;
		font-size: 1.2rem;
	}
`

export const PublicCollectionsLable = styled.div`
	display: grid;
	grid-template-columns: auto auto 2rem;
	align-items: center;

		& .ownership{
			display:flex;
			margin-left: 2rem;
			margin-top: 1rem;
			margin-bottom: 1rem;
			flex: 2;
			font-weight: 500;

			& .owner-name{
				margin-left: 1rem;
				flex: 2;
				font-weight: 200;
			}
	}
`

export const PublicCollectionListItem = styled.div`
	display: grid;
	grid-template-columns: auto 10rem;
`

export const RemoveIcon = styled.span`
	background: url(${trashIcon}) center no-repeat;
	height: 2.5rem;
	width: 2rem;
`

const TextButton = css`
	font-weight: bold;
	line-height: 1.5rem;
	letter-spacing: .05rem;
	background: transparent;
	border: none;
	cursor: pointer;
	outline: none;
`

export const RemoveButton = styled.button`
	display: flex;
	align-items: center;
  justify-content: center;
	color: #ff4c4c;
	${TextButton}
	text-align: center !important;

	& > span {
		margin-left: .5rem;
	}
`

export const NoContentFiller = styled.h4`
	margin: 3rem;
`

export const FeedbackMessage = styled.div`
	height: 100px;
	display: flex;
  justify-content: center;
  align-items: center;

	& > p {
		font-weight: 200;
		font-size: 15px;
		margin: auto;
	}
`