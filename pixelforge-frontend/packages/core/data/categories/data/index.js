import {
    MonitorCog,
    CircuitBoard,
    Cpu,
    Monitor,
    Keyboard,
    Mouse,
    Headphones,
    MemoryStick,
    HardDrive,
    Microchip
} from 'lucide-react';

export const categories = [
    {
        name: 'Gaming PCs',
        slug: 'gaming-pcs',
        description: 'Ready-to-play builds',
        icon: MonitorCog
    },
    {
        name: 'Graphics Cards',
        slug: 'graphics-cards',
        description: 'Next-gen graphics performance',
        icon: CircuitBoard
    },
    {
        name: 'Processors',
        slug: 'processors',
        description: 'Powerful CPUs for every build',
        icon: Cpu
    },
    {
        name: 'Monitors',
        slug: 'monitors',
        description: 'High-refresh displays',
        icon: Monitor
    },
    {
        name: 'Keyboards',
        slug: 'keyboards',
        description: 'Mechanical precision',
        icon: Keyboard
    },
    {
        name: 'Mice',
        slug: 'mice',
        description: 'Precision sensors',
        icon: Mouse
    },
    {
        name: 'Headsets',
        slug: 'headsets',
        description: 'Immersive audio',
        icon: Headphones
    },
    {
        name: 'Motherboards',
        slug: 'motherboards',
        description: 'The foundation of your build',
        icon: Microchip
    },
    {
        name: 'Memory',
        slug: 'memory',
        description: 'High-speed RAM',
        icon: MemoryStick
    },
    {
        name: 'Storage',
        slug: 'storage',
        description: 'Fast SSDs and storage solutions',
        icon: HardDrive
    }
];