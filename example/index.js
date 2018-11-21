import React from 'react';
import ReactDOM from 'react-dom';
import {
  PageRefresh
} from '../src'

const App = () => (
  <PageRefresh className="App" >
    <h1 className="App-Title">Hello Parcel x React</h1>
    {
      Array.from({length: 15})
        .map((i, key) => {
          return <div key={key}>
            <p style={{fontSize: 18}}>{key}</p>
          </div>
        })
    }
  </PageRefresh>
);

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}