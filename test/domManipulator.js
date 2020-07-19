import ReactDOM from 'react-dom';


export const createContainer = () => {
  const container = document.createElement('div');

  return {
    render: komponen => ReactDOM.render(komponen, container),
    container
  };
};
