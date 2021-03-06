import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Spinner, Row, Col, Table} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {AppState} from '../../../store/reducers';
import {listTasks} from '../middlewares/list';
import {reset} from '../../core/actions/list';
import Breadcrumb from '../../core/components/Breadcrumb';
import ServerErrors from '../../core/components/ServerErrors';
import {BreadcrumbItem} from '../../core/models/BreadcrumbItem';
import {ITask} from '../models/ITask';
import {CoreListState, ICoreListResetAction} from '../../core/types/list';

interface IProps {
  list: CoreListState;
  listTasks(): void;
  reset(): ICoreListResetAction;
}

const ListView: React.FC<IProps> = ({list, listTasks, reset}) => {
  const {t} = useTranslation();

  useEffect(() => {
    listTasks();

    return () => {
      reset();
    };
  }, [listTasks, reset]);

  return (
    <>
      <Row>
        <Col>
          <Breadcrumb items={[new BreadcrumbItem(t('task.title'))]} />
          <ServerErrors errors={list.errors} />
          <Link to={'/tasks/add'} className={'btn btn-primary mb-3'}>
            <i className={'fas fa-plus'}></i> {t('task.add.title')}
          </Link>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>{t('task.list.title')}</th>
                <th style={{width: '15%'}}></th>
              </tr>
            </thead>
            <tbody>
              {list.payload.map((task: ITask) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>
                    <Link
                      to={`/tasks/${task.id}/edit`}
                      className={'btn btn-outline-secondary btn-sm'}
                    >
                      <i className={'fas fa-edit'}></i>{' '}
                      {t('form.buttons.update')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      {list.loading && (
        <Row className={'justify-content-md-center'}>
          <Col md={'auto'}>
            <Spinner animation={'border'} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default connect(
  (state: AppState) => ({
    list: state.core.list
  }),
  dispatch => ({
    ...bindActionCreators({listTasks, reset}, dispatch)
  })
)(ListView);
