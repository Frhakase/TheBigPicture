import React, { useState, useEffect } from 'react'

import * as utils from '../../utils'
import * as cst from '../../constants'
import "./style.scss"


const useToggleAction = (props) => {
  const {
    activateLabel,
    deactivateLabel,
    item,
    icon,
    step,
    display,
    user,
    activeStep,
    hidden,
    setActiveStep
  } = props

  const [active, toggleActive] = utils.hooks.useToggle(false)
  const [label, setLabel] = useState(activateLabel)
  const [html, setHtml] = useState(null)

  useEffect(() => {
    if (html)
      setHtml(display(item, user))
  }, [item])

  useEffect(() => {
    if (active) {
      setLabel(deactivateLabel)
      setActiveStep({ step, activateLabel })
      setHtml(display(item, user))
    }
    else {
      if (activeStep.step == step && (activeStep.activateLabel == activateLabel))
        setActiveStep({ step: null, activateLabel: null})
      setLabel(activateLabel)
      setHtml(null)
    }
  }, [active])

  useEffect(() => {
    if (active && (activeStep.step !== step || activeStep.activateLabel !== activateLabel)) {
      toggleActive()
    }
  }, [activeStep])

  if (hidden) return null
  // This is the format taken as input by dropdownItem
  const menu = {
    leftIcon: icon,
    name: label,
    onClick: () => toggleActive()
  }

  return [html, menu]
}

export default useToggleAction
