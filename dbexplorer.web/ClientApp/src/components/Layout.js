import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import DbConnection from "./DbConnection";

export default props => (
    <Grid fluid>
        <Row>
            <Col sm={12}>
                <DbConnection />
            </Col>
        </Row>
    <Row>
      <Col  sm={12}>
        {props.children}
      </Col>
    </Row>
  </Grid>
);
