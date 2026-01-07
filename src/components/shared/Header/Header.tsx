"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'


const Header = () => {
    const menuItems = [
        {
            title: "Home", url: "/"
        },
        {
            title: "Features", url: "/features"
        },
        {
            title: "Shop", url: "/shop"
        },
        {
            title: "Pages", url: "/pages"
        },
        {
            title: "Blog", url: "/blog"
        }
    ]
    const pathname = usePathname();
    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
            <div className='flex justify-between items-center px-8 py-4 '>
                {/* menu items */}
                <nav className='hidden md:flex items-center gap-6'>
                    {menuItems.map((item) =>(
                        <Link href={item.url} key={item.url} className={pathname === item.url ? "text-yellow-600" : ""}
>
                            {item.title}
                        </Link>
                    ))}
                </nav>
                {/* logo */}
                <nav className='text-3xl'>BigBoom</nav>
                {/* authentication */}
                <nav>login</nav>

            </div>

        </header>
    )
}

export default Header