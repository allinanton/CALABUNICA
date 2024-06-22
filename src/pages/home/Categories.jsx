import React from 'react'


const categoryItems = [
    { id: 1, title: "Supe/Ciorbe", image: "/images/home/category/img1.png" },
    { id: 2, title: "Fel Principal", image: "/images/home/category/img2.png" },
    { id: 3, title: "Meniul Zilei", image: "/images/home/category/img3.png" },
    { id: 4, title: "Salata", image: "/images/home/category/img4.png" },
    { id: 5, title: "Sandvis", image: "/images/home/category/img5.png" },
    { id: 6, title: "Desert", image: "/images/home/category/img6.png" }
]

const Categories = () => {
    return (
        <div className={`max-w-screen-3xl container mx-auto xl:px-40 px-4 py-16`}>
            <div className='text-center'>
                <p className='subtitle'>Mâncăruri Tradiționale și Surprize Culinare</p>
                <h2 className='title font-primary font-bold'>Delicatesele Noastre</h2>
            </div>

            {/* category cards */}
            <div className='flex flex-col sm:flex-row flex-wrap gap-8 justify-around items-center mt-12'>
                {
                    categoryItems.map((item, i) => (
                        <div key={i} className='shadow-lg rounded-md bg-white py-6 px-5 w-72 mx-auto text-center cursor-pointer hover:-translate-y-4 transition-all duration-300 z-10'>
                            <div className='w-full mx-auto flex items-center justify-center'><img src={item.image} alt="" className='bg-[#ff7f66] p-5 rounded-full w-28 h-28' /></div>
                            <div className='mt-4 space-y-2'>
                                <h5 className='text-[#1E1E1E] font-semibold'>{item.title}</h5>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Categories