import React from 'react'
import Banner from '../../components/Banner'
import Categories from './Categories'
import SpecialDishes from './SpecialDishes'
import OurServices from './OurServices'

const Home = () => {
  return (
    <div>
       <Banner/>
       <Categories/>
       <SpecialDishes/>
       <OurServices/>
    </div>
  )
}

export default Home