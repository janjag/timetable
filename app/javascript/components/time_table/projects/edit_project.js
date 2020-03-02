import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import Preloader from '../../shared/preloader';
import * as Api from '../../shared/api';

function EditProject(props) {
  const projectId = parseInt(props.match.params.id, 10);

  const defaultProjectParams = {
    name: '',
    color: '0c0c0c',
    leader_id: '',
    work_times_allows_task: true,
    active: true,
  };

  const [project, setProject] = useState(defaultProjectParams);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [redirectToReferer, setRedirectToReferer] = useState();

  function getProject() {
    if (!projectId) return;

    Api.makeGetRequest({ url: `/api/projects/${projectId}` })
      .then((response) => {
        setProject(response.data);
      });
  }

  function getUsers() {
    Api.makeGetRequest({ url: '/api/users' })
      .then((response) => setUsers(response.data));
  }

  function onChange(e) {
    const { name, value } = e.target;

    setProject({ ...project, [name]: value });
  }

  function onCheckboxChange(e) {
    const { name } = e.target;

    setProject({ ...project, [name]: !project[name] });
  }

  function onSubmit(e) {
    e.preventDefault();

    project.color = project.color[0] === '#' ? project.color.substring(1) : project.color;

    if (projectId) {
      Api.makePutRequest({ url: `/api/projects/${project.id}`, body: { project } })
        .then(() => setRedirectToReferer('/projects/list'))
        .catch((results) => setErrors(results.errors));
    } else {
      Api.makePostRequest({ url: '/api/projects', body: { project } })
        .then(() => setRedirectToReferer('/projects/list'))
        .catch((results) => setErrors(results.errors));
    }
  }

  useEffect(() => {
    getProject();
    if (currentUser.admin) getUsers();
  }, []);

  if (redirectToReferer) return <Redirect to={redirectToReferer} />;

  if (!projectId || projectId === project.id) {
    return (
      <form>
        { currentUser.isSuperUser() && (
          <div>
            <div className="form-group">
              {errors.name && <div className="error-description">{errors.name.join(', ')}</div>}
              <input
                className={`${errors.name ? 'error' : ''} form-control`}
                type="text"
                name="name"
                placeholder={I18n.t('common.name')}
                onChange={onChange}
                value={project.name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="leader">{I18n.t('apps.projects.leader')}</label>
              <select
                name="leader_id"
                id="leader"
                className="form-control"
                value={project.leader_id || ''}
                onChange={onChange}
              >
                <option value="" />
                { users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {currentUser.fullName.apply(user)}
                  </option>
                )) }
              </select>
            </div>
            <div className="form-group">
              <label>
                {I18n.t('apps.projects.active')}
                <input type="checkbox" name="active" checked={project.active} onChange={onCheckboxChange} />
              </label>
            </div>
          </div>
        )}
        <div className="form-group" />
        <input
          type="color"
          name="color"
          value={((project.color && project.color[0] !== '#') ? '#' : '') + project.color}
          onChange={onChange}
        />
        <div className="form-group">
          <label>
            {I18n.t('apps.projects.work_times_allows_task')}
            <input
              type="checkbox"
              name="work_times_allows_task"
              checked={project.work_times_allows_task}
              onChange={onCheckboxChange}
            />
          </label>
        </div>
        <NavLink className="btn btn-default" to="/projects/list">{I18n.t('common.cancel')}</NavLink>
        <input className="btn btn-primary" type="submit" value={I18n.t('common.save')} onClick={onSubmit} />
      </form>
    );
  }
  return <Preloader rowsNumber={5} />;
}

export default EditProject;
