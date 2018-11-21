import React from 'react';
import ReactDOM from 'react-dom';
import {
  PageRefresh,
  LazyPic
} from '../src'
import p1 from './images/1.jpg'
import p2 from './images/2.jpg'
import p3 from './images/3.jpg'
import p4 from './images/4.jpg'
import p5 from './images/5.jpg'

const pics = [p1, p2, p3, p4, p5]

const App = () => (
  <PageRefresh 
    onScrollEnd={e => {
      LazyPic.checkLazy()
    }}
    className="App" >
    <h1 className="App-Title">Hello Parcel x React</h1>
    {
      Array.from({length: 15})
        .map((i, key) => {
          return <div key={key}>
            <LazyPic src={pics[key % 5]} style={{width: '100%', minHeight: 200}} />
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