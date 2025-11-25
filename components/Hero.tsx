'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/hero.module.css';


export default function Hero() {
const images = [
'/images/class.jpg',
'/images/flayer2.jpg'
];


const [index, setIndex] = useState(0);


useEffect(() => {
const interval = setInterval(() => {
setIndex((i) => (i + 1) % images.length);
}, 7000);
return () => clearInterval(interval);
}, []);


return (
<div className={styles.hero}>
{images.map((src, i) => (
<img
key={i}
src={src}
className={`${styles.parallaxImg} ${index === i ? styles.active : ''}`}
alt="Hero"
/>
))}
</div>
);
}