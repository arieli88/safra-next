import styles from '../styles/section.module.css';


export default function Gallery() {
return (
<section id="gallery" className={styles.section}>
<h2>תמונות נוספות</h2>
<div className={styles.galleryPlaceholder}>
כאן ייכנס הקרוסלה שלך (נשאיר כמו שביקשת)
</div>
</section>
);
}