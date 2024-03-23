import { createBrowserRouter } from 'react-router-dom'

import Admin from './Admin'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Admin/>
  },
  {
    path: '*',
    element: <Admin/>
  }
])

export {router};