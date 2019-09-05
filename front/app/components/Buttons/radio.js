import React from 'react'
import PropTypes from 'prop-types'
import "./style.scss"


const RadioButton = ({ classname, isPushed, setIsPushed, icon}) => {
  return (
  	<span className="level-item is-narrow">
	  <a
		onClick={() => setIsPushed(!isPushed)}
		className={"button tbp-radio " + classname + (isPushed ? " is-active" : "")}>
		<span className="icon is-small"><i className={icon}></i></span>
	  </a>
    </span>
  )
}

RadioButton.propTypes = {
	isPushed: PropTypes.bool.isRequired,
	setIsPushed: PropTypes.func.isRequired,
	icon: PropTypes.string.isRequired
}

export default RadioButton
