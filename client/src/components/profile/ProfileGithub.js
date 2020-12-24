import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import Spinner from '../layouts/Spinner'
import { getGithubRepos } from '../../actions/profile'

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username)
  }, [getGithubRepos, username])
  return <div></div>
}

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array,
  username: PropTypes.string,
}

const mapStateToProps = (state) => ({
  repost: state.profile.repos,
})
export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub)
