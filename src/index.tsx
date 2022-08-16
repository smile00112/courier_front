import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import App from './app/App';
import { createStore } from './app/store/createStore';
import history from './app/utils/history';
//import reportWebVitals from './reportWebVitals';
//import Home from './app/components/pages/HomePage/Home';

 
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>     
//     <Home />  
//   </React.StrictMode>
// );

const store = createStore();

// const rootElement = document.getElementById("root")!;
// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//         <App /> 
//     </Provider> 
//   </React.StrictMode>
// );
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

//reportWebVitals();
