const slideContainerStyle = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
}

const slidesStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'row',
}

const slideItemStyle = {
  flexShrink: 0,
  width: '100%',
}

const dotWrapStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  width: '100%',
  height: 30,
  left: 0,
  bottom: 0,
}

const dotStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: '#d8d8d8',
  marginRight: 5,
}

export {
  slideContainerStyle,
  slidesStyle,
  slideItemStyle,
  dotWrapStyle,
  dotStyle,
}