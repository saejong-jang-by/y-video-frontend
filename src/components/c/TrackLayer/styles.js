import styled from 'styled-components'

export const Icon = styled.div`
	/* transform: rotate(45deg); */
  background: url(${props => props.src}) center no-repeat;
  background-size: contain;

  height: 2rem;
  width: 2rem;
`

export const Style = styled.div`

	& .events {
		width: 100%;
		border-bottom: 1px solid var(--light-blue);
	}

	& .layer-event {
		border: 1px solid var(--light-blue) !important;
		border-radius: 3px;
		height: 14% !important;
		padding: 1px;
		min-width: 1%;
		overflow: hidden !important;
		display: flex !important;
		background-color: white;
		z-index: 10;

		&	p {
			font-size: 1rem;
			text-align: left;
			margin: auto auto auto 0px;
			padding: 1px 3px 1px 3px;

		}
		&	div{
			text-align: right;
			margin: auto 0px auto auto;
			padding: 0px 3px 0px 3px;
		}
	}
`