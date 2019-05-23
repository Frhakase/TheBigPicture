import React, { useState } from 'react'
import PropTypes from 'prop-types'
import NewBigPicture from '../new'
import "./style.scss"


const BigPictureModalLook = ({ post, active, setActive, initBp }) => {

  const [bp, setBP] = useState(initBp)
  const [publish, setPublish] = useState(null)
  const headline = initBp.id == undefined ? "Nouvelle vue" : "Modification de la vue"

  return (
    <div className={"modal" + (active ? " is-active" : "")}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{headline}</p>
          <button className="delete" onClick={() => setActive(false)} aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <NewBigPicture bp={bp} setBP={setBP} />
        </section>
        <footer className="modal-card-foot">
          <div className="control">
            <button
              className="button is-dark"
              onClick={() => { setActive(false); post(bp) }}>
              Publier
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

BigPictureModalLook.propTypes = {
  post: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  initBp: PropTypes.object.isRequired
}

export default BigPictureModalLook