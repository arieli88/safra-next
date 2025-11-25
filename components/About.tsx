import styles from '../styles/section.module.css';


export default function About() {
return (
<section id="about" className={styles.section}>
<h2 id="about2">מה זה בית מדרש ספרא?</h2>
<p>
בית מדרש "ספרא" הוא מקום פתוח לחיילות ולחיילים – דתיים, חילונים וכולם
באמצע – שמחפשים רגע של משמעות, חיבור וקהילה.
</p>
<div className={styles.imagesRow}>
<img src="/images/flayer5.jpg" alt="ספרא" />
<img src="/images/flayer4.jpg" alt="משב רוח" />
</div>
</section>
);
}