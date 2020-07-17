import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from './Appointment'
import { appointmentSampel } from './dataSampel';

ReactDOM.render(
  <AppointmentsDayView appointments={appointmentSampel} />,
  document.getElementById('root')
);
