import styled from 'styled-components'

export const Style = styled.div`
	padding-top: 8.4rem;
	padding-bottom: 15rem;
	overflow-y: scroll;
	height: calc(100vh - 23.4rem);

	& > div {
		& .ayamelPlayer,
		& .videoBox,
		& .mediaPlayer {
			width: 100% !important;
			height: 70vh;
		}
		& .sliderContainer {
			padding-bottom: 0 !important;
		}
	}

	& .player-wrapper {
		position: relative;
		background-color: black;
	}
`

export const Blank = styled.div`
	position: absolute;
	background-color: ${props => props.blank ? ('black') : ('transparent')};
	z-index: 10;
	width: 100%;
	height: 100%;
	top: 0px;
`

export const Comment = styled.div`
	--x: ${props => props.commentX !== 0 ? `${props.commentX}%` : `0%`};
	--y: ${props => props.commentY !== 0 ? `${props.commentY}%` : `0%`};

	position: absolute;
	top: var(--y);
	left: calc(var(--x));
	font-size: 2rem;
	color: white; style={{ w}}
	z-index: 15;
`
export const Transcript = styled.div`
	position: relative;
	width: ${props => props.displayTranscript ? ('50rem') : ('2rem')};
	max-height: 50rem;
	padding: 0px 10px 0px 10px;
	border: 1px solid black;
	transition: 1s ease;
	display: flex;
	/* background-color: ${props => props.displayTranscript ? ('white') : ('var(--light-blue)')}; */

	& .side-bar {
		position: absolute;
		left: 0px;
		width: 40px;
		height: 100%;
		background-color: rgba(5, 130, 202, 0.5);
		
		& img {
			cursor: pointer;
		}
	}

	& .toggle-transcript {
		position: absolute;
		top: 2px;
		left: 5px;
		width: 30px;
		height: 30px;
		transition: .5s ease;
		transform: ${props => props.displayTranscript ? ('rotate(-180deg)') : ('rotate(0deg)')};
	}

	& .main-bar {
		visibility: ${props => props.displayTranscript ? ('visible') : ('hidden')};
		margin-left: 45px;
		max-height: 50rem;
		overflow-y: scroll !important;


		& .transcript-title {
			display: flex;
			width: 100%;
			height: 30px;

			& h2 {
				margin: auto;
				font-weight: 500;
				text-align: center;
			}
		}
	}


	& .transcript-row {

		cursor: pointer;

		& p {
			border-bottom: 1.5px solid var(--light-blue);
			padding: 5px 0px 5px 0px;
			word-wrap: break-word;
			font-size: 1.4rem;
		}
	}
`

export const Subtitles = styled.div`
	position: absolute;
	height: 15%;
	bottom: 50px;
	background-color: rgba(0,0,0,0.5);
	font-size: 1.5rem;
	color: #ffffff;
	z-index: 20;
	width: 100%;
	text-align: center;
`

export default Style
