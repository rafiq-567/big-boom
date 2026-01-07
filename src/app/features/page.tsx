import React from 'react'
import { features } from '../../../data/features'

const FeaturesPage = () => {
  return (
    <section className='max-w-6xl mx-auto px-6 py-12'>
      <h1>Features</h1>
      <div>
        {features.map((feature) => (
          <div key={feature.id}>
            <h1>{feature.title}</h1>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesPage