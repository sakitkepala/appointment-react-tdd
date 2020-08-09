import ReactDOM from 'react-dom';
import ReactTestUtils, { act } from 'react-dom/test-utils';


export const denganEvent = (name, value) => ({
  target: { name, value }
});

export const createContainer = () => {
  const container = document.createElement('div');

  const element = selector => container.querySelector(selector);
  const elementSemua = selector => Array.from(
    container.querySelectorAll(selector)
  );

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = (idForm, name) => form(idForm).elements[name];
  const labelFor = elemenForm => container.querySelector(`label[for="${elemenForm}"]`);

  const simulasikanEvent = namaEvent =>
    (element, dataEvent) => ReactTestUtils.Simulate[namaEvent](element, dataEvent);

  const simulasikanEventDanWait = namaEvent =>
    async (element, dataEvent) => await act(
      async () => ReactTestUtils.Simulate[namaEvent](element, dataEvent)
    );

  return {
    render: komponen => ReactDOM.render(komponen, container),
    container,
    element,
    elementSemua,
    form,
    field,
    labelFor,
    click: simulasikanEvent('click'),
    change: simulasikanEvent('change'),
    submit: simulasikanEventDanWait('submit')
  };
};
