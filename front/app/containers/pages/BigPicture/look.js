import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Loader from '../../../components/Loader'
import BigPictureList, { createList } from '../../../components/BigPicture/list'
import EndorsmentPreview from '../../../components/Endorsment/preview'
import RatingList from '../../../components/Rating/list'
import BigPicturePreview from '../../../components/BigPicture/preview'
import Results from '../../../components/BigPicture/results'
import Context from '../../../components/Context'
import List from '../../../components/List'
import { RatingButton } from '../../../components/Rating/buttons'
import AuthorIcon from '../../../components/User/authorIcon'
import EditionModalButton from '../../../components/Buttons/modal'
import NewBigPicture from '../../../components/BigPicture/new'
import BigPictureModal from '../../../components/BigPicture/modal'
import AddBigPictureButton from '../../../components/Buttons/add'

import { ReactComponent as ContentIcon } from '../../../images/icons/book.svg'
import { ReactComponent as ChildrenIcon } from '../../../images/icons/sitemap.svg'
import { ReactComponent as RatingsIcon } from '../../../images/icons/reasons.svg'
import { ReactComponent as ReferenceIcon } from '../../../images/icons/reference.svg'
import { ReactComponent as EndorsmentIcon } from '../../../images/icons/star.svg'
import { ReactComponent as ChronometerIcon } from '../../../images/icons/chronometer.svg'

import * as cst from '../../../constants'
import "./style.scss"


const BigPictureViewLook = (props) => {
  const {
    user,
    match,
    bigPicture,
    children,
    endorsments,
    getBigPicture,
    getReferences,
    getLastBps,
    getRatingsPage,
    getEndorsmentsPage } = props
  const [init, setter] = useState(bigPicture)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!bigPicture)
      getBigPicture(match.params.subjectId)
    setter(bigPicture)
  }, [match])

  useEffect(() => {
    if (bigPicture)
      setter(bigPicture)
  }, [bigPicture])

  return (
    <div className="vde-bigpicture-page">
      <Loader condition={!bigPicture}>
        { header(init) }
        <div className="vde container section">
          { content(init, user, setter) }
          { analyse(init, user) }
          { comments(init, getRatingsPage, user) }
          { references(init, getReferences) }
          { endorsmentsList(init, endorsments, getEndorsmentsPage) }
          { results(init) }
          { lastbps(init, getLastBps) }
          { lastratings(init, getRatingsPage) }
        </div>
      </Loader>
    </div>
  )
}

const header = (bigPicture) => {
  if (!bigPicture) return null

  return (
    <div className={"hero " + cst.CLASSNAMES[bigPicture.kind]}>
      <div className="vde container section">
        <div className="level is-mobile">
          <div style={{maxWidth: "100%"}} className="level-left">
            <span className="level-item author-icon">
              <AuthorIcon userId={bigPicture.author} showIcon={true} clickable={true}/>
            </span>
            <h1 className="vde title">
              {bigPicture.title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

const content = (bigPicture, user, setter) => {
  const [hidden, setHidden] = useState(false)

  if (!bigPicture) return null

  return (
    <div className="container vde section section-field">
      <div className="level is-mobile vde-header">
        <div className="level-left" onClick={ () => setHidden(!hidden) }>
          <ContentIcon className="vde header-button level-item image is-32x32" />
          <p className="vde subtitle level-item">Contenu</p>
          { user.id == bigPicture.author ? editButton(bigPicture, setter) : null}
        </div>
      </div>
      {
        !hidden
          ? <Context bpId={bigPicture.id} />
          : null
      }
    </div>
  )
}


const editButton = (init, setter) => (
  <EditionModalButton
    init={init}
    setter={setter}
    classname={"button tbp-radio title-button"}
    icon={cst.icons.EDIT}
    EditionModal={BigPictureModal}
    NewItem={NewBigPicture}
  />
)

const analyse = (bigPicture, user) => {
  if (!bigPicture) return null

  return (
    <BigPictureList
      name={`bp-page-${bigPicture.id}-children-list`}
      icon={<ChildrenIcon className="vde header-button level-item image is-32x32" />}
      filter={(bp) => bp.parent == bigPicture.id}
      parent={bigPicture}
      count={bigPicture.children.length}
      sortFunc={(a, b) => a.title > b.title ? 1 : -1}
      getPage={null}
      title={cst.labels.CHILD_LIST_TITLE}
      loadFirstPage={true}
      emptyMessage={cst.labels.BP_EMPTY_BODY}
      buttons={[
        () => backButton(bigPicture),
        () => addBigPictureButton(bigPicture, user)
      ]}
      margin={0}
    />
  )
}


const backButton = (bp) => {
  const to = bp.parent == null ? "/" : `/subject/${bp.subject}/bigPicture/${bp.parent}`
  return (
    <div className="button tbp-radio title-button is-narrow" key={`back${bp.id}`}>
      <Link to={to}>
        <span className="icon is-small"><i className="fas fa-step-backward"></i></span>
      </Link>
    </div>
  )
}

const addBigPictureButton = (bigPicture, user) => {
  if (user.id !== bigPicture.author) return null
  return <AddBigPictureButton key={`add${bigPicture.id}`} bigPicture={bigPicture} />
}


const comments = (bigPicture, getRatingsPage, user) => {
  if (!bigPicture) return null

  return (
    <RatingList
      name={`bp-page-${bigPicture.id}-ratings-list`}
      icon={<RatingsIcon className="vde header-button level-item image is-32x32" />}
      target={bigPicture}
      filter={(rating) => rating.target_bp == bigPicture.id}
      loadFirstPage={false}
      count={bigPicture.ratingCount}
      getPage={
        (page, options, requestId) => getRatingsPage(page, { ...options, bigpicture: bigPicture.id }, requestId)
      }
      title={cst.labels.REASON_LIST_TITLE}
      emptyMessage={cst.labels.MSG_NO_REASON}
      buttons={[() => addRatingButton(bigPicture, user)]}
      margin={0}
    />
  )
}


const addRatingButton = (bigPicture, user) => {
  const initRating = {
    value: 0,
    target_bp: bigPicture.id,
    target_rating: null,
    author_id: user.id,
    reason: "",
    subject: bigPicture.subject
  }
  if (!initRating.subject)
    initRating.subject = bigPicture.id
  return (
    <RatingButton
      initRating={initRating}
      classname="button tbp-radio title-button"
      icon={cst.icons.PLUS}
    />
  )
}


const references = (bigPicture, getReferences) => {
  if (!bigPicture) return null

  return (
    <BigPictureList
      name={`bp-page-${bigPicture.id}-references-list`}
      icon={<ReferenceIcon className="vde header-button level-item image is-32x32" />}
      filter={(bp) => bigPicture.references.indexOf(bp.id) != -1}
      parent={bigPicture}
      count={bigPicture.referenceCount}
      getPage={
        (page, options, requestId) => getReferences(page, { ...options, reference: bigPicture.id }, requestId)
      }
      title={cst.labels.REFERENCE_LIST_TITLE}
      loadFirstPage={false}
      emptyMessage={cst.labels.MSG_NO_REFERENCE}
      margin={0}
    />
  )
}


const endorsmentsList = (bigPicture, endorsments, getPage) => {
  if (!bigPicture) return null

  const endorsmentsSort = (endorsmentA, endorsmentB) => {
    const dateA = new Date(endorsmentA.date)
    const dateB = new Date(endorsmentB.date)
    return dateA >= dateB ? 1 : -1
  }

  return (
    <List
      name={`bp-page-${bigPicture.id}-endorsments-list`}
      icon={<EndorsmentIcon className="vde header-button level-item image is-32x32" />}
      items={endorsments}
      container={(endorsment) => <EndorsmentPreview key={`previewendorsment-${endorsment.id}`} endorsmentId={endorsment.id} />}
      emptyMessage={cst.labels.BP_HAS_NO_ENDORSMENT}
      sortFunc={endorsmentsSort}
      count={bigPicture.endorsmentCount}
      getPage={
        (page, options, reqId) => getPage(page, { ...options, bigpicture: bigPicture.id }, reqId)
      }
      loadFirstPage={false}
      title={cst.labels.ENDORSMENT_LIST_TITLE}
      margin={0}
    />
  )
}

const lastbps = (bigPicture, getLastBps) => {
  if (!bigPicture || bigPicture.subject !== bigPicture.id) return null

  return (
    <BigPictureList
      name={`bp-page-${bigPicture.id}-lastbigpictures-list`}
      icon={<ChronometerIcon className="vde header-button level-item image is-32x32" />}
      filter={(bp) => bigPicture.subject == bp.subject && bp.id !== bigPicture.subject}
      count={0}
      getPage={null}
      title={cst.labels.LAST_ACTIVITY_BP}
      loadFirstPage={false}
      emptyMessage={cst.labels.NO_ACTIVITY_BP}
      margin={0}
    />
  )
}

const lastratings = (bigPicture, getRatingsPage) => {
  if (!bigPicture || bigPicture.subject !== bigPicture.id) return null

  return (
    <RatingList
      name={`bp-page-${bigPicture.id}-lastratings-list`}
      icon={<ChronometerIcon className="vde header-button level-item image is-32x32" />}
      filter={(rating) => rating.subject == bigPicture.id}
      loadFirstPage={false}
      count={bigPicture.ratingFamilyCount}
      sortFunc={(a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1)}
      getPage={
        (page, options, requestId) => getRatingsPage(page, { ...options, subject: bigPicture.id }, requestId)
      }
      title={cst.labels.LAST_ACTIVITY_RATING}
      emptyMessage={cst.labels.NO_ACTIVITY_RATING}
      margin={0}
    />
  )
}

const results = (bigPicture) => {
  if (!bigPicture) return null

  return (
    <Results showHeader={true} bigPictureId={bigPicture.id} margin={0} />
  )
}


export default BigPictureViewLook
