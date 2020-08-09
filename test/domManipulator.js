import ReactDOM from 'react-dom';


export const createContainer = () => {
  const container = document.createElement('div');

  const element = selector => container.querySelector(selector);
  const elementSemua = selector => Array.from(
    container.querySelectorAll(selector)
  );

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = (idForm, name) => form(idForm).elements[name];
  const labelFor = elemenForm => container.querySelector(`label[for="${elemenForm}"]`);

  return {
    render: komponen => ReactDOM.render(komponen, container),
    container,
    element,
    elementSemua,
    form,
    field,
    labelFor
  };
};
