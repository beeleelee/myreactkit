import React from 'react'
import {
  Carousel,
  Page,
} from '../dist/myreactkit.esm'
import p1 from './images/1.jpg'
import p2 from './images/2.jpg'
import p3 from './images/3.jpg'
import p4 from './images/4.jpg'
import p5 from './images/5.jpg'

const pics = [p1, p2, p3, p4, p5]

export const P = () => (
  <Page>
    <Carousel 
      style={{height: 264}}
      className="App" >
      {
        Array.from({length: 5})
          .map((i, key) => {
            return <div key={key}>
              <img src={pics[key]} style={{width: '100vw'}} />
            </div>
          })
      }
    </Carousel>
  </Page>
)
export default P