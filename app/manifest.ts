// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Schwangerschaftsrechner',
        short_name: 'SSW Rechner',
        description: 'Berechne deine Schwangerschaftswoche und wichtige Termine',
        start_url: '/',
        display: 'standalone',
        background_color: '#FAF7F1',
        theme_color: '#FAEDCD',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}