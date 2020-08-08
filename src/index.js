import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { AppointmentsDayView } from './AppointmentsDayView'
import { appointmentSampel } from './dataSampel';
import { FormCustomer } from './FormCustomer';

ReactDOM.render(
  // <AppointmentsDayView appointments={appointmentSampel} />,
  <FormCustomer />,
  document.getElementById('root')
);
