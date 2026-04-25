import { span } from 'motion/react-client';
import React from 'react'

const DocPreview = ({ label, url }: { label: string; url: string }) => {
    const isImage = url.match(/\.(jpeg|jpg|png|webp)$/) != null
    const isPDF = url.match(/\.pdf$/) != null
    return (
        <div className='bg-gray-50 rounded-2xl border overflow-hidden shadow-sm'>
            <div className='px-4 py-2 border-b text-sm font-semibold'>
                {label}
            </div>
            <div className='h-52 flex items-center justify-center bg-white'>
                {!url && <span className='text-xs text-gray-400'>Image not uploaded</span>}
                {isImage && <img src={url} alt={label} className='h-full w-full object-cover' />}
                {isPDF && <iframe src={url} title={label} className='h-full w-full' />}

            </div>
            {url && (
                <a
                    href={url}
                    target='_blank'
                    className='block text-center text-sm py-2 hover:bg-gray-100 font-medium'
                >
                    View Document
                </a>
            )}
        </div>
    )
}

export default DocPreview