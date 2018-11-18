const scrollViewWrapperStyle = {
  overflow: 'hidden',
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

const scrollContentStyle = {
  position: 'absolute',
  width: '100%',
  top: 0,
  left: 0,
}

const refreshWrapStyle = {
  position: 'absolute',
  width: '100%',
  left: 0,
  top: -40,
  height: 40,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}

const scrollBarStyle = {
  position: 'absolute',
  width: 2,
  background: '#aeaeae',
  height: 0,
  borderRadius: 1,
  top: 0,
  right: 4,
  opacity: 0,
  transition: 'opacity 300ms ease'
}

export {
  scrollViewWrapperStyle,
  scrollContentStyle,
  refreshWrapStyle,
  scrollBarStyle,
}